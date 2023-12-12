import React, { useEffect, useState } from "react";
import "./Home.css";
import CreatePost from "../../CreatePost/CreatePost";
import Post from "../../Post/Post";
import PostSkeleton from "../../Post/PostSkeleton";
import { homeTimeline } from "../../../Services/TweetService";

function Home() {

  const [postList, setPostList] = useState([]);

  const addActiveClass = (e) => {
    let elements = document.getElementsByClassName('tab');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
    e.target.classList.add("active");

  }

  const getHomeTimeline = async () => {
    const response = await homeTimeline();
    let data = await response.json();

    setPostList(data);
  }

  useEffect(() => {
    getHomeTimeline();
  }, [])

  return (
    <div className="home">
      <div className="navbara">
        <div id="for-you" className="for-you tab active" onClick={addActiveClass}>For you</div>
        <div id="following" className="following tab" onClick={addActiveClass}>Following</div>
      </div>
      <CreatePost />
      {postList.length > 0 ?
        postList.map((post) => {
          return <Post data={post} key={post._id} />
        })
        : <PostSkeleton />}
    </div>
  );
}

export default Home;
