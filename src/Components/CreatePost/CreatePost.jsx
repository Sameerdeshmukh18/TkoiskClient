import React, { useState } from 'react'
import "./CreatePost.css"
import profilepic from "../../Assets/profilepic.jpg"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function CreatePost() {

    const [enableEmojiPicker, setEnambleemojiPicker] = useState(false);
    const [postContent, setpostContent] = useState({ postText: "" });

    const onChange = (e) => {
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

    return (
        <div className='post-box'>
            <div className="profile-pic-box">
                <img src={profilepic} alt="Profile" className="profile-pic" />
            </div>
            <div className="post-inputs">
                <textarea className="input-text-post" id='autoresizing' placeholder='What say?!' name="postText" value={postContent.postText} onChange={onChange} />
                <div className="post-items">
                    <span onClick={() => { setEnambleemojiPicker(!enableEmojiPicker) }}><i className="bi bi-emoji-smile"></i></span>
                    <button className='post-btn'>Post</button>

                </div>

                {enableEmojiPicker ? <Picker data={data} onEmojiSelect={setEmoji} theme={'light'} /> : ""}

            </div>



        </div>
    )
}

export default CreatePost