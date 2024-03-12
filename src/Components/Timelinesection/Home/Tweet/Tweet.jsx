import React from 'react'
import './Tweet.css'

function Tweet(props) {
    const tweet = props.tweet
    const time = '08:03 pm'
    const date = '12 Mar 24'
    const views = '3,815'
    const comments = [
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment',
        'Dummy Comment'
    ]
    const closeTweet = () => {
        props.closeTweet()
    }

    return (
        <div className='tweet-container'>
            <div className='tweet'>
                <div>
                    <div className='user-photo'>
                        <div className='photo'>Photo</div>
                    </div>
                    <div className='user-name'>
                        <h4>{tweet.user.name}</h4>
                        <span>@{tweet.user.username}</span>
                    </div>
                    <div>
                        <button className='follow-btn'>Follow</button>
                    </div>
                </div>
                <div className='tweet-text'>{tweet.tweet_text}</div>
            </div>
            <div className='tweet-properties'>
                <span className='time light-grey-color'>{time}</span>
                <span className='dot'></span>
                <span className='date light-grey-color'>{date}</span>
                <span className='dot'></span>
                <span className='views'><b>{views}</b> Views</span>
            </div>
            <hr />
            <div><b>{tweet.liked_by.length}</b> Likes</div>
            <hr />
            <div className='comments'>
                {
                    comments.length > 0 ? (
                        comments.map((comment, index) => {
                            return <p key={index+1}>{comment} {index+1}</p>
                        })
                    ) : ""
                }
            </div>
            <div>
                <button onClick={closeTweet}>Back</button>
            </div>
        </div>
    )
}

export default Tweet
