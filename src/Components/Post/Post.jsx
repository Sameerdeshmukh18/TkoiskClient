import React, { useState, useEffect } from 'react'
import './Post.css'
import profilepic from "../../Assets/profilepic.jpg"
import 'react-loading-skeleton/dist/skeleton.css'
import verified_sign from "../../Assets/verify.png"
import MoreActions from '../MoreActions/MoreActions'
import { likeTweet, dislikeTweet } from '../../Services/TweetService'
import { getUserDetails } from '../../Services/UserService'


function Post(props) {

    const data = props.data;
    const [isPopupOpen, setPopupOpen] = useState(false);
    const isLikedTemp = data.liked_by.includes(localStorage.getItem('user_id'));
    const [likeCount, setlikeCount] = useState(0);
    const [isLiked, setisLiked] = useState(isLikedTemp)
    const [user, setUser] = useState({
        "name": "user",
        "username": "username",
        "isVerified": false
    });

    const togglePopup = () => {
        setPopupOpen(!isPopupOpen);
    };

    const like_Tweet = async (id) => {

        setisLiked(true);
        const response = await likeTweet(id);
        if (response.ok) {
            setlikeCount(likeCount + 1);
            console.log(response);
        }
    }

    const disLike_Tweet = async (id) => {
        setisLiked(false);
        const response = await dislikeTweet(id);
        if (response.ok) {
            setlikeCount(likeCount - 1);
            console.log(response);
        }

    }

    useEffect(() => {
        setlikeCount(data.liked_by.length);
        setUser(data.user);
        console.log(data.user);
    }, [data])

    
    return (
        <div className='post'>

            <div className="profile-pic-icon">
                <img src={profilepic} alt="Profile" className="profile-pic" />


            </div>
            <div className="post-info">
                <div className="post-profile-info">
                    <div className="username-verfied-box">
                        <div className="creator-name">{user.name}</div>
                        {user.isVerified
                            ?
                            <div className="verified"><img src={verified_sign} alt="" className="verified-sign-img" /></div>
                            :
                            null
                        }
                        <div className="creator-username">@{user.username}</div>
                    </div>


                    <div className="more-icon" onClick={togglePopup}>
                        <i className="bi bi-three-dots"></i>
                    </div>

                    {isPopupOpen && (
                        <MoreActions />
                    )}

                </div>
                <div className="main-content">
                    <p>
                        {data.tweet_text}
                    </p>

                </div>
                <div className="post-actions">

                    {isLiked
                        ?
                        <div className='like action-icon' onClick={() => disLike_Tweet(data._id)}  > <i className="bi bi-heart-fill" style={{ color: 'red' }} ></i> {likeCount}</div>
                        :
                        <div className="like action-icon" onClick={() => like_Tweet(data._id)}  > <i className="bi bi-heart" ></i> {likeCount}</div>
                    }

                    <div className="share action-icon"><i className="bi bi-chat"></i></div>
                    <div className="comment action-icon"><i className="bi bi-share"></i></div>
                </div>
            </div>
        </div>
    )
}

export default Post