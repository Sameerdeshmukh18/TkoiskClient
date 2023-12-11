import React, { useState } from 'react'
import "./CreatePost.css"
import profilepic from "../../Assets/profilepic.jpg"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { postTweet } from "../../Services/TweetService"

function CreatePost() {

    const [enableEmojiPicker, setEnambleemojiPicker] = useState(false);
    const [postContent, setpostContent] = useState({ postText: "" });
    const [isLoading, setisLoading] = useState(false);


    const onChange = (e) => {

        setisLoading(false)
        setpostContent({ postText: e.target.value })
        let textarea = document.querySelector("#autoresizing");
        textarea.addEventListener('input', autoResize, false);

        function autoResize() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        }
    }
    const setEmoji = (e) => {
        let currentText = postContent.postText
        setpostContent({
            postText: currentText + e.native
        });
    }
    const handleClick = async () => {
        setisLoading(true);
        const response = await postTweet(postContent.postText);
        console.log(response);
        if (response.status == 201) {
            setpostContent({ postText: "" })
            setisLoading(false);

        }
    }

    return (
        <div className='post-box'>
            <div className="profile-pic-box">
                <img src={profilepic} alt="Profile" className="profile-pic" />
            </div>
            <div className="post-inputs">
                <textarea className="input-text-post" id='autoresizing' placeholder='What say?!' name="postText" value={postContent.postText} onChange={onChange} />
                <div className="post-items">
                    <span onClick={() => { setEnambleemojiPicker(!enableEmojiPicker) }}><i className="bi bi-emoji-smile"></i></span>
                    <button className='post-btn' onClick={handleClick}>
                        {isLoading ?
                            <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            : "Post"
                        }</button>

                </div>

                {enableEmojiPicker ? <Picker data={data} onEmojiSelect={setEmoji} theme={'light'} /> : ""}

            </div>



        </div>
    )
}

export default CreatePost