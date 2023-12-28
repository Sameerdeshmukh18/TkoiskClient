import React from 'react'
import './Post.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function PostSkeleton() {
    return (
        <div className='post'>

            <div className="profile-pic-icon">

                <Skeleton containerClassName='flex-1' width="35px" circle="true" height="35px" />

            </div>
            <div className="post-info">
                <div className="post-profile-info">

                    <Skeleton containerClassName='flex-1' width="250px" height="30px" />

                    {/* <div className="more-icon">
                        <i className="bi bi-three-dots"></i>
                    </div> */}

                </div>
                <div className="main-content">

                    <Skeleton count={5.5} />
                </div>
                <div className="post-actions">
                    <div className="like action-icon"><Skeleton containerClassName='flex-1' width="25px" height="20px" /></div>
                    <div className="share action-icon"><Skeleton containerClassName='flex-1' width="25px" height="20px" /></div>
                    <div className="comment action-icon"><Skeleton containerClassName='flex-1' width="25px" height="20px" /></div>
                </div>
            </div>

        </div>
    )
}

export default PostSkeleton