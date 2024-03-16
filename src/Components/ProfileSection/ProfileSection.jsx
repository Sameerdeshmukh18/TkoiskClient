import React, { useEffect, useState } from 'react';
import './ProfileSection.css';
import client from '../../apolloClient';
import { useQuery, useMutation, gql } from '@apollo/client'
import ApolloAPI from "../../ApiCllient";
import InfiniteScroll from 'react-infinite-scroll-component'
import Post from "../Post/Post";
import PostSkeleton from "../Post/PostSkeleton";

function ProfileSection() {

    const imageBaseURL = 'https://tkiosk-users-data.s3.ap-south-1.amazonaws.com'
    const [userId, setUserId] = useState(localStorage.getItem('user_id'))
    const [selectedProfilePhotoFile, setSelectedProfilePhotoFile] = useState(null)
    const [selectedCoverPhotoFile, setSelectedCoverPhotoFile] = useState(null)
    const COVER_PHOTO_KEY = 'CoverPhoto'
    const PROFILE_PHOTO_KEY = 'ProfilePhoto'

    const [myPostList, setMyPostList] = useState([]);
    const [cursor, setCursor] = useState();
    const ITEMS_PER_PAGE = 10;
    const hasMoreDataToLoad = cursor == "END" ? false : true

    // This function definition should be above state variable 'coverImageVersion'
    const getCoverImageLatestVersionToAvoidCacheIssue = () => {
        const coverImageVersionStored = localStorage.getItem('CoverPhotoVersion')
        return coverImageVersionStored ? parseInt(coverImageVersionStored) : 1
    }
    const [coverImageVersion, setCoverImageVersion] = useState(getCoverImageLatestVersionToAvoidCacheIssue())
    const [coverImageURL, setCoverImageURL] = useState(`${imageBaseURL}/${userId}/${COVER_PHOTO_KEY}`)

    // This function definition should be above state variable 'profileImageVersion'
    const getProfileImageLatestVersionToAvoidCacheIssue = () => {
        const profileImageVersionStored = localStorage.getItem('ProfilePhotoVersion')
        return profileImageVersionStored ? parseInt(profileImageVersionStored) : 1
    }
    const [profileImageVersion, setProfileImageVersion] = useState(getProfileImageLatestVersionToAvoidCacheIssue())
    const [profileImageURL, setProfileImageURL] = useState(`${imageBaseURL}/${userId}/${PROFILE_PHOTO_KEY}`)


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
            }).catch((err) => {
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

    // Handles when file is selected for cover photo
    const handleCoverFileChange = (event) => {
        const file = event.target.files[0]
        setSelectedCoverPhotoFile(file)
    };

    // Handles when file is selected for profile photo
    const handleProfileFileChange = (event) => {
        const file = event.target.files[0]
        setSelectedProfilePhotoFile(file)
    }

    // Update the state variable to hold selected cover photo file and give to upload function
    const handleCoverPhotoUpload = () => {
        uploadToS3Bucket(selectedCoverPhotoFile, COVER_PHOTO_KEY)
    }
    // Update the state variable to hold selected profile photo file and give to upload function
    const handleProfilePhotoUpload = () => {
        uploadToS3Bucket(selectedProfilePhotoFile, PROFILE_PHOTO_KEY)
    }

    // Uploads the photo to s3 bucket
    const uploadToS3Bucket = (file, fileForDescription) => {
        if (!file) return
        const fileName = getFileName(fileForDescription)
        getPresignedURL(fileName, file.type)
            .then((presignedURL) => {
                // Upload the file to S3 using the pre-signed URL
                fetch(presignedURL, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    }
                })
                    .then((res) => {
                        console.log('File Uploaded Successfully :)')

                        if(fileForDescription == COVER_PHOTO_KEY) {
                            setCoverImageVersion(coverImageVersion+1)
                            setSelectedCoverPhotoFile(null)
                            localStorage.setItem('CoverPhotoVersion', coverImageVersion)
                        }

                        if(fileForDescription == PROFILE_PHOTO_KEY) {
                            setProfileImageVersion(profileImageVersion+1)
                            setSelectedProfilePhotoFile(null)
                            localStorage.setItem('ProfilePhotoVersion', profileImageVersion)
                        }
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
                    <img src={`${coverImageURL}?v=${coverImageVersion}`} alt="Cover Photo" />
                </div>
                <div className="profile-picture">
                <img src={`${profileImageURL}?v=${profileImageVersion}`} alt="Profile Photo" />
                </div>
                <div className="profile-card">
                    <div className="username-name">
                        <div className="profile-name"><b>{userDetails.name}</b></div>
                        <div className="profile-username">@{userDetails.username}</div>
                    </div>

                    {/* Below code is for testing the upload image functionality */}
                    <input type="file" onChange={handleCoverFileChange} />
                    <button onClick={handleCoverPhotoUpload} className='upload-btn'>Update Cover Photo</button>
                    <hr />
                    <input type="file" onChange={handleProfileFileChange} />
                    <button onClick={handleProfilePhotoUpload} className='upload-btn'>Update Profile Photo</button>

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
                            {/* <PostSkeleton />
                            <PostSkeleton /> */}
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
                                {/* <PostSkeleton />
                                <PostSkeleton /> */}
                            </>
                        )}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default ProfileSection