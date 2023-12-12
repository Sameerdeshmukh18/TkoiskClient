import React, { useEffect, useState } from "react";
import "./Home.css";
import CreatePost from "../../CreatePost/CreatePost";
import Post from "../../Post/Post";
import PostSkeleton from "../../Post/PostSkeleton";
import { homeTimeline } from "../../../Services/TweetService";
import { getUserDetails } from "../../../Services/UserService";

function Home() {

  const [postList, setPostList] = useState([]);

  const addActiveClass = (e) => {
    let elements = document.getElementsByClassName('tab');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
    e.target.classList.add("active");

  }
  const getUser = async (id) => {
    const response = await getUserDetails(id);
    return response;
  }

  const getHomeTimeline = async () => {
    const response = await homeTimeline();
    let data = await response.json();

    const userPromises = data.map(async (post) => {
      const userResponse = await getUser(post.user_id);
      return await userResponse.json();
    });

    const userData = await Promise.all(userPromises);

    // Combine user data with posts
    data.forEach((post, index) => {
      post.user = userData[index];
    });

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
