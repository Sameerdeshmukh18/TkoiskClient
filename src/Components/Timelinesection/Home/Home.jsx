import React from "react";
import "./Home.css";
import CreatePost from "../../CreatePost/CreatePost";
import Post from "../../Post/Post";
import PostSkeleton from "../../Post/PostSkeleton";

function Home() {

  const addActiveClass = (e) =>{
    let elements = document.getElementsByClassName('tab');
    for (var i = 0; i<elements.length; i++) {
      elements[i].classList.remove('active');
   }
    e.target.classList.add("active");

  }
  return (
    <div className="home">
      <div className="navbara">
        <div id="for-you" className="for-you tab active" onClick={addActiveClass}>For you</div>
        <div id="following" className="following tab" onClick={addActiveClass}>Following</div>
      </div>
      <CreatePost/>
      <Post/>
      <PostSkeleton/>
      <PostSkeleton/>
      <PostSkeleton/>
      <PostSkeleton/>
      <PostSkeleton/>
      
    </div>
  );
}

export default Home;
