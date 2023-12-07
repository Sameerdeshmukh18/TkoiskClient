import React, {useState} from 'react'
import './Post.css'
import profilepic from "../../Assets/profilepic.jpg"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import verified_sign from "../../Assets/verify.png"
import MoreActions from '../MoreActions/MoreActions'





function Post() {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const togglePopup = () => {
        setPopupOpen(!isPopupOpen);
    };
    return (
        <div className='post'>

            <div className="profile-pic-icon">
                <img src={profilepic} alt="Profile" className="profile-pic" />


            </div>
            <div className="post-info">
                <div className="post-profile-info">
                    <div className="username-verfied-box">
                        <div className="creator-name">Virat Kohli</div>
                        <div className="verified"><img src={verified_sign} alt="" className="verified-sign-img" /></div>
                        <div className="creator-username">@vkohli18</div>
                    </div>


                    <div className="more-icon" onClick={togglePopup}>
                        <i className="bi bi-three-dots"></i>
                    </div>

                    {isPopupOpen && (
                        <MoreActions/>
                    )}

                </div>
                <div className="main-content">
                    <p>
                        I am thrilled to announce that one8 Commune is now coming to Gurgaon, and you're invited to be part of this incredible journey! Join us in the spirit of communing from Sept 23 as we can't wait to share the love with you all! #ad #one8commune @one8world
                    </p>



                </div>
                <div className="post-actions">
                    <div className="like action-icon"><i className="bi bi-heart"></i></div>
                    <div className="share action-icon"><i className="bi bi-chat"></i></div>
                    <div className="comment action-icon"><i className="bi bi-share"></i></div>
                </div>
            </div>
        </div>
    )
}

export default Post