import React, { useState, useEffect } from 'react'
import './Post.css'
import profilepic from "../../Assets/profilepic.jpg"
import 'react-loading-skeleton/dist/skeleton.css'
import verified_sign from "../../Assets/verify.png"
import MoreActions from '../MoreActions/MoreActions'
import { likeTweet, dislikeTweet } from '../../Services/TweetService'
import { Modal, Button } from 'react-bootstrap';


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
    const [replyText, setReplyText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const togglePopup = () => {
        setPopupOpen(!isPopupOpen);
    };

    const like_Tweet = async (id) => {
        const response = await likeTweet(id);
        if (response.ok) {
            setlikeCount(likeCount + 1);
            setisLiked(true);
            console.log(response);
        }
    }

    const disLike_Tweet = async (id) => {
        const response = await dislikeTweet(id);
        if (response.ok) {
            setlikeCount(likeCount - 1);
            setisLiked(false);
            console.log(response);
        }

    }

    const handleComment = () => {
        console.log("Comment");
    }

    useEffect(() => {
        setlikeCount(data.liked_by.length);
        setUser(data.user);
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

                    <div className="comment action-icon" onClick={handleShow} ><i className="bi bi-chat"></i></div>
                    <div className="share action-icon"><i className="bi bi-share"></i></div>

                </div>
            </div>
            <Modal show={showModal} onHide={handleClose} style={{ borderRadius: '40px' }}>
                <Modal.Header closeButton className="border-0" style={{ marginRight: 'auto' }} />
                <Modal.Body >
                    <div className='post border border-1 border-dark'>
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
                        </div>
                    </div>
                    <p className='mt-3' >Replying to @{user.username}</p>
                    <textarea
                        className='border mt-2'
                        placeholder="Post your reply"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ width: '100%', minHeight: '100px' }}
                    />
                </Modal.Body>
                <Modal.Footer className="border-0" >
                    <Button variant="primary" className="ml-auto rounded-pill" style={{ width: '100px', fontSize: '20px' }} onClick={handleComment}>
                        Post
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Post