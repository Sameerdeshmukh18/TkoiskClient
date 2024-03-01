import React, { useState } from "react";
import "./CreatePost.css";
import profilepic from "../../Assets/profilepic.jpg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { postTweet } from "../../Services/TweetService";
import { gql } from "@apollo/client";
import client from "../../apolloClient";
import { useRecoilState } from "recoil";
import { PostList } from "../../State/atoms/PostListState"

function CreatePost() {
  const [enableEmojiPicker, setEnambleemojiPicker] = useState(false);
  const [postContent, setpostContent] = useState({ postText: "", });
  const [isLoading, setisLoading] = useState(false);
  const [postList, setPostList] = useRecoilState(PostList);

  const onChange = (e) => {
    setisLoading(false);
    setpostContent({ postText: e.target.value });
    let textarea = document.querySelector("#autoresizing");
    textarea.addEventListener("input", autoResize, false);
    function autoResize() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }
  };
  const setEmoji = (e) => {
    let currentText = postContent.postText;
    setpostContent({
      postText: currentText + e.native,
    });
  };

  const CREATE_TWEET = gql`
    mutation Mutation($tweet: String!) {
      createTweet(tweet: $tweet) {
        _id
      }
    }
  `;

  const GET_TWEET = gql`
    query Query($tweetId: ID!) {
      getTweetById(tweet_id: $tweetId) {
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
        createdAt
      }
    }
  `

  const handleClick = async (e) => {
    e.preventDefault();
    setisLoading(true);
    console.log("Tweet text " + postContent.postText);

    const response = await client.mutate({
      mutation: CREATE_TWEET,
      variables: {
        tweet: postContent.postText,
      },
    });
    console.log(response);
    if (response.data.createTweet._id) {
      const res = await client.query({
        query: GET_TWEET,
        variables: {
          tweetId: response.data.createTweet._id
        }

      });
      if (res.data.getTweetById.tweet_text) {
        console.log(res.data);
        var newPostList = [res.data.getTweetById, ...postList]
        console.log(newPostList)
        setPostList(newPostList);
        
      }
      setpostContent({ postText: "" })
      setisLoading(false);

    }
    // console.log(postContent.postText)
    // const response = await postTweet(postContent.postText);
    // console.log(response);
    // if (response.status == 201) {
    //     setpostContent({ postText: "" })
    //     setisLoading(false);
    // }
  };

  return (
    <div className="post-box">
      <div className="profile-pic-box">
        <img src={profilepic} alt="Profile" className="profile-pic" />
      </div>
      <div className="post-inputs">
        <textarea
          className="input-text-post"
          id="autoresizing"
          placeholder="What say?!"
          name="postText"
          value={postContent.postText}
          onChange={onChange}
        />
        <div className="post-items">
          <span
            onClick={() => {
              setEnambleemojiPicker(!enableEmojiPicker);
            }}
          >
            <i className="bi bi-emoji-smile"></i>
          </span>
          <button
            className="post-btn"
            onClick={handleClick}
            disabled={!postContent.postText}
          >
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Post"
            )}
          </button>
        </div>

        {enableEmojiPicker ? (
          <Picker data={data} onEmojiSelect={setEmoji} theme={"light"} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default CreatePost;
