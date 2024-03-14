import React, { useEffect, useState } from 'react';
import './ProfileSection.css';
import client from '../../apolloClient';
import { useQuery, useMutation, gql } from '@apollo/client'
import profilepic from "../../Assets/profilepic.jpg"
import ApolloAPI from "../../ApiCllient";
import InfiniteScroll from 'react-infinite-scroll-component'
import Post from "../Post/Post";
import PostSkeleton from "../Post/PostSkeleton";

function ProfileSection() {

    const [userId, setUserId] = useState(localStorage.getItem('user_id'))
    const imageBaseURL = 'https://tkiosk-users-data.s3.ap-south-1.amazonaws.com'
    const [coverImageURL, setCoverImageURL] = useState(`${imageBaseURL}/${userId}/CoverPhoto`)
    const [selectedFile, setSelectedFile] = useState(null);
    const [myPostList, setMyPostList] = useState([]);
    const [cursor, setCursor] = useState();
    const ITEMS_PER_PAGE = 10;
    const hasMoreDataToLoad = cursor == "END" ? false : true

    const QUERY_TO_GET_PRESIGNED_URL = gql`
    mutation Mutation($fileName: String!, $fileType: String!) {
        getProfilePhotoPresignedUploadURL(file_name: $fileName, file_type: $fileType) {
            file_name
            file_type
            uploadURL
        }
    }
    `
    const ME = gql`query Me {
        me {
          bio
          isVertified
          name
          username
          followers {
            _id
          }
          following {
            _id
          }
          dob
        }
      }`

    const MyPostsQuery = gql`
    query GetMyTweets($first: Int, $after: ID) {
        getMyTweets(first: $first, after: $after) {
           endCursor
              tweets {
                _id
                  user {
                    name
                    username
                    isVertified
                  }
                  tweet_text
                  liked_by {
                    _id
                  }
                  comments {
                    _id
                  }
                createdAt
              }
        }
      }`

    const { loading, error, data, fetchMore } = useQuery(
        MyPostsQuery, {
        variables: {
            first: ITEMS_PER_PAGE,
            after: cursor
        },

    });

    const [userDetails, setUserDetails] = useState({ name: '', username: '', followers: [], followersCount: 0, following: [], followingCount: 0, dob: '', bio: '' });

    const fetchMoreData = () => {
        console.log("inside fetch more data")
        setTimeout(() => {
            fetchMore({
                variables: {
                    first: ITEMS_PER_PAGE,
                    after: cursor
                }
            }).then((res) => {
                if (res) {
                }
                setMyPostList(myPostList.concat(res.data.getMyTweets.tweets));
                setCursor(res.data.getMyTweets.endCursor);
                console.log(`Cursor: ${cursor}`)
            }).catch((err) => {
                console.log('ERROR -x-x-x-x-x-x-x-x')
                console.log(err)
            })
        }, 1500)
    }

    const fetchUserDetails = async () => {

        const { data } = await new ApolloAPI().client.query({
            query: ME
        })
        if (data.me.name) {
            setUserDetails(
                {
                    name: data.me.name,
                    username: data.me.username,
                    followers: data.me.follolwers,
                    followersCount: userDetails.followers?.length || 0,
                    following: data.me.following,
                    followingCount: userDetails.following?.length || 0,
                    dob: data.me.dob,
                    bio: data.me.bio
                }
            )
            console.log("followers", userDetails.followingCount);
            console.log("following", userDetails.followingCount);
        }

    }

    /*
    Get presigned URL to upload a file in s3 bucket  
    */
    const getPresignedURL = async (fileName, fileType) => {
        const { data } = await client.mutate(
            {
                mutation: QUERY_TO_GET_PRESIGNED_URL,
                variables: {
                    "fileName": fileName,
                    "fileType": fileType
                }
            }
        )
        return data.getProfilePhotoPresignedUploadURL.uploadURL
    }

    /*
    Helper function to get file name, pass values either 'ProfilePhoto' or 'CoverPhoto'
    */
    const getFileName = (imageForDescription) => {
        return `${userId}/${imageForDescription}`
    }

    /*
    Invokes when file is selected and updates the state variable to hold the selected file
    */
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setSelectedFile(file)
    };


    // Uploads the photo to s3 bucket
    const handleUpload = async () => {
        if (!selectedFile) return
        const fileName = getFileName('CoverPhoto')
        getPresignedURL(fileName, selectedFile.type)
            .then((presignedURL) => {
                // Upload the file to S3 using the pre-signed URL
                fetch(presignedURL, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: {
                        'Content-Type': selectedFile.type,
                    }
                })
                    .then((res) => {
                        console.log('File Uploaded Successfully :)')

                        // only for testing purpose
                        // let a = document.createElement('a')
                        // a.target = '_blank'
                        // a.href = `${imageBaseURL}/${fileName}`
                        // a.click()

                        // Reset state variables after file upload
                        setSelectedFile(null)
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const addActiveClass = (e) => {
        let elements = document.getElementsByClassName("profile-navbar-item");
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
        e.target.classList.add("active");
    };

    useEffect(() => {
        fetchUserDetails();
        fetchMoreData();
    }, [])



    return (
        <div className='ProfileSection' id='profileSection'>
            <div className="profile-details">
                <div className="cover-picture">
                    <img src={coverImageURL} alt="Cover Photo" />
                </div>
                <div className="profile-picture">
                    <img src={profilepic} alt="Profile Photo" />
                </div>
                <div className="profile-card">
                    <div className="username-name">
                        <div className="profile-name"><b>{userDetails.name}</b></div>
                        <div className="profile-username">@{userDetails.username}</div>
                    </div>

                    {/* Below code is for testing the upload image functionality */}
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload Image</button>

                    <div className="profile-bio">{userDetails.bio}</div>
                    <div className="connections-count">
                        <div className="profile-following">Following <b>{userDetails.followingCount}</b></div>
                        <div className="profile-followers">Followers <b>{userDetails.followersCount}</b></div>
                    </div>

                </div>
                <ul className='profile-navbar'>
                    <li className='profile-navbar-item active' onClick={addActiveClass}>Posts</li>
                    <li className='profile-navbar-item' onClick={addActiveClass}>Replies</li>
                    <li className='profile-navbar-item' onClick={addActiveClass}>Likes</li>
                </ul>
                <InfiniteScroll
                    dataLength={myPostList.length}
                    next={fetchMoreData}
                    hasMore={hasMoreDataToLoad}
                    loader={
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    }
                    scrollableTarget="profileSection"
                    endMessage={
                        <p className="end-message" style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >

                    {myPostList.length > 0 ? (
                        myPostList.map((post) => {
                            return <Post data={post} key={post._id} />;
                        })
                    )

                        : (
                            <>
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                            </>
                        )}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default ProfileSection