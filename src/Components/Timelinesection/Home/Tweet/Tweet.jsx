import React, { useRef } from 'react'
import './Tweet.css'

function Tweet(props) {
    const tweetHeaderControlRef = useRef(null)
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

    const handleScroll = (event) => {
        event.target.scrollTop == 0 ? tweetHeaderControlRef.current.classList.remove('scroll-shadow') : tweetHeaderControlRef.current.classList.add('scroll-shadow')
    }

    return (
        <div className='tweet-container' onScroll={handleScroll}>
            <div className='tweet-header-control' ref={tweetHeaderControlRef}>
                <button className='back-to-posts-icon-btn' onClick={closeTweet}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <div className='tweet-info-container'>
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
                <div className='separator-line'></div>
                <div><b>{tweet.liked_by.length}</b> Likes</div>
                <div className='separator-line'></div>
                <div className='comments'>
                    {
                        comments.length > 0 ? (
                            comments.map((comment, index) => {
                                return <p key={index + 1}>{comment} {index + 1}</p>
                            })
                        ) : ""
                    }
                </div>
                <div className='tweet-footer'></div>
            </div>
        </div>
    )
}

export default Tweet
