import React, { useState, useEffect } from "react";
import "./Post.css";
import profilepic from "../../Assets/profilepic.jpg";
import "react-loading-skeleton/dist/skeleton.css";
import verified_sign from "../../Assets/verify.png";
import MoreActions from "../MoreActions/MoreActions";
import { likeTweet, dislikeTweet } from "../../Services/TweetService";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { useMutation, gql } from "@apollo/client";
import client from "../../apolloClient";
import TimeAgo from 'timeago-react';

function Post(props) {
  const data = props.data;
  const [isPopupOpen, setPopupOpen] = useState(false);
  const isLikedTemp = data.liked_by.some(
    (item) => item._id === localStorage.getItem("user_id")
  );
  const [likeCount, setlikeCount] = useState(0);
  const [isLiked, setisLiked] = useState(isLikedTemp);
  const [user, setUser] = useState({
    name: data.user.name,
    username: data.user.username,
    isVerified: data.user.isVerified,
  });
  const [replyText, setReplyText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  function handleSelect(eventKey) {
    alert(`selected ${eventKey}`);
  }

  const LIKE_TWEET = gql`
    mutation Mutation($tweetId: ID!) {
      likeTweet(tweet_id: $tweetId) {
        _id
      }
    }
  `;

  const DISLIKE_TWEET = gql`
    mutation DisLikeTweet($tweetId: ID!) {
      disLikeTweet(tweet_id: $tweetId) {
        _id
      }
    }
  `;

  const like_Tweet = async (id) => {
    const response = await client.mutate({
      mutation: LIKE_TWEET,
      variables: {
        tweetId: id,
      },
    });
    console.log(response);
    if (response.data) {
      setlikeCount(likeCount + 1);
      setisLiked(true);
    }
  };

  const disLike_Tweet = async (id) => {
    const response = await client.mutate({
      mutation: DISLIKE_TWEET,
      variables: {
        tweetId: id,
      },
    });
    console.log(response);
    if (response.data) {
      setlikeCount(likeCount - 1);
      setisLiked(false);
    }
  };

  const CREATE_COMMENT = gql`
    mutation Mutation($tweetId: ID!, $comment: String!) {
      createComment(tweet_id: $tweetId, comment: $comment) {
        _id
      }
    }
  `;

  const handleComment = async (id) => {
    const response = await client.mutate({
      mutation: CREATE_COMMENT,
      variables: {
        tweetId: id,
        comment: replyText,
      },
    });
    console.log(response);
    if (response.data.createComment._id) {
      setReplyText("");
      handleClose();
    }
  };

  const openTweet = (event) => {
    props.openTweet(data, event)
  }

  useEffect(() => {
    setlikeCount(data.liked_by.length);
  }, [data]);

  return (
    <div className="main-post-container post" onClick={openTweet}>
      <div className="profile-pic-icon">
        <img src={profilepic} alt="Profile" className="profile-pic" />
      </div>
      <div className="post-info">
        <div className="post-profile-info">
          <div className="username-verfied-box">
            <div className="creator-name">{user.name}</div>
            {user.isVerified ? (
              <div className="verified">
                <img src={verified_sign} alt="" className="verified-sign-img" />
              </div>
            ) : null}
            <div className="creator-username">@{user.username}</div>
            <div className="dot">.</div>
            <div className="time-ago">
              <TimeAgo
                datetime={data.createdAt}
              />
            </div>
          </div>

          <div className="more-icon exclude-click" >

            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle style={{ backgroundColor: "transparent", border: "none", color: "black" }} >
                <i className="bi bi-three-dots"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1"><i className="bi bi-flag" />  Report user</Dropdown.Item>
                <Dropdown.Item eventKey="2"><i className="bi bi-person-add" />  Follow user</Dropdown.Item>
                <Dropdown.Item eventKey="3"><i className="bi bi-bookmark" />  Bookmark</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* {isPopupOpen && <MoreActions modalAction={isPopupOpen} />} */}
        </div>
        <div className="main-content">
          <p>{data.tweet_text}</p>
        </div>
        <div className="post-actions">
          {isLiked ? (
            <div
              className="like action-icon exclude-click"
              onClick={() => disLike_Tweet(data._id)}
            >
              {" "}
              <i className="bi bi-heart-fill" style={{ color: "red" }}></i>{" "}
              {likeCount}
            </div>
          ) : (
            <div
              className="like action-icon exclude-click"
              onClick={() => like_Tweet(data._id)}
            >
              {" "}
              <i className="bi bi-heart"></i> {likeCount}
            </div>
          )}

          <div className="comment action-icon exclude-click" onClick={handleShow}>
            <i className="bi bi-chat"></i> {data.comments.length}{" "}
          </div>
          <div className="share action-icon exclude-click">
            <i className="bi bi-share"></i>
          </div>
        </div>
      </div>
      <Modal
        className="exclude-click"
        show={showModal}
        onHide={handleClose}
        style={{ borderRadius: "40px" }}
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{ marginRight: "auto" }}
        />
        <Modal.Body>
          <div className="post border border-1 border-dark">
            <div className="profile-pic-icon">
              <img src={profilepic} alt="Profile" className="profile-pic" />
            </div>
            <div className="post-info">
              <div className="post-profile-info">
                <div className="username-verfied-box">
                  <div className="creator-name">{user.name}</div>
                  {user.isVerified ? (
                    <div className="verified">
                      <img
                        src={verified_sign}
                        alt=""
                        className="verified-sign-img"
                      />
                    </div>
                  ) : null}
                  <div className="creator-username">@{user.username}</div>
                </div>

                <div className="more-icon" onClick={togglePopup}>
                  <i className="bi bi-three-dots"></i>
                </div>
                {isPopupOpen && <MoreActions />}
              </div>
              <div className="main-content">
                <p>{data.tweet_text}</p>
              </div>
            </div>
          </div>
          <p className="mt-3">Replying to @{user.username}</p>
          <textarea
            className="border mt-2"
            placeholder="Post your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ width: "100%", minHeight: "100px" }}
          />
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="primary"
            className="ml-auto rounded-pill"
            style={{ width: "100px", fontSize: "20px" }}
            onClick={() => handleComment(data._id)}
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Post;
