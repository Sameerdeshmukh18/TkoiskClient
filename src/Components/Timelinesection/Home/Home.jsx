import React, { useEffect, useState } from "react";
import "./Home.css";
import CreatePost from "../../CreatePost/CreatePost";
import Post from "../../Post/Post";
import PostSkeleton from "../../Post/PostSkeleton";
import { homeTimeline } from "../../../Services/TweetService";
import { gql, useQuery } from "@apollo/client";
import client from "../../../apolloClient";
import { useRecoilState } from "recoil";
import {PostList} from '../../../State/atoms/PostListState'

function Home() {

  const HOMETIMELINE = gql`
    query Query {
      homeTimeline {
        _id
        user {
          name
          username
          isVertified
        }
        tweet_text
        liked_by {
          _id
        }
        comments {
          _id
        }
      }
    }
  `;


  const [postList, setPostList] = useRecoilState(PostList);
  //const { loading_h, error_h, data } = useQuery(HOMETIMELINE)

  const addActiveClass = (e) => {
    let elements = document.getElementsByClassName("tab");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    e.target.classList.add("active");
  };

  const getHomeTimeline = async () => {
    const { loading_h, error_h, data } = await client.query({
      query: HOMETIMELINE,
    });
    if (error_h) {
      console.log(error_h);
    }
    setPostList(data.homeTimeline);
  };

  useEffect(() => {
    getHomeTimeline();
  }, []);

  return (
    <div className="home">
      <div className="navbara">
        <div
          id="for-you"
          className="for-you tab active"
          onClick={addActiveClass}
        >
          For you
        </div>
        <div id="following" className="following tab" onClick={addActiveClass}>
          Following
        </div>
      </div>
      <CreatePost />
      {postList.length > 0 ? (
        postList.map((post) => {
          return <Post data={post} key={post._id} />;
        })
      ) : (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
    </div>
  );
}

export default Home;
