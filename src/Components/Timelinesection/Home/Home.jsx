import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import CreatePost from "../../CreatePost/CreatePost";
import Post from "../../Post/Post";
import PostSkeleton from "../../Post/PostSkeleton";
import { homeTimeline } from "../../../Services/TweetService";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import client from "../../../apolloClient";
import { useRecoilState } from "recoil";
import { PostList } from '../../../State/atoms/PostListState'
import InfiniteScroll from 'react-infinite-scroll-component'
import Tweet from './Tweet/Tweet'

function Home() {
  const containerRef = useRef(null);
  const navigate = useNavigate()
  const location = useLocation()
  const [tweet, setTweet] = useState(null)
  const [isScrollingDisabled, setIsScrollingDisabled] = useState(false);

  const HOMETIMELINE = gql`
    query Query($first: Int, $after: ID) {
      homeTimeline(first: $first, after: $after) {
        endCursor
        tweets {
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
    }
  `;


  const [postList, setPostList] = useRecoilState(PostList);
  const [cursor, setCursor] = useState(null);
  let ITEMS_PER_PAGE = 10;

  const { loading, error, data, fetchMore } = useQuery(
    HOMETIMELINE, {
    variables: {
      first: ITEMS_PER_PAGE,
      after: cursor
    },

  });

  const addActiveClass = (e) => {
    let elements = document.getElementsByClassName("tab");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    e.target.classList.add("active");
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          after: cursor
        }
      }).then((res) => {
        setPostList(postList.concat(res.data.homeTimeline.tweets));
        setCursor(res.data.homeTimeline.endCursor);
      }).catch((err) => {
        console.log(err)
      })
    }, 1500)
  }
  const hasMoreDataToLoad = cursor == "END" ? false : true


  // Below query returns information of a tweet
  const TWEET_INFO_QUERY = gql`
      query GetTweetById($tweetId: ID!) {
          getTweetById(tweet_id: $tweetId) {
              tweet_text
              _id
              liked_by {
                  _id
              }
              user {
                  username
                  name
                  isVertified
                  _id
              }
          }
      }
  `
  const [getTweetById, { tweetLoading, tweetError, tweetData }] = useLazyQuery(TWEET_INFO_QUERY, {
    onCompleted: (result) => {
      openTweet(result.getTweetById, null)
    },
  });

  /*
  Add 'exclude-click' class to elements which should not trigger main tweet dialog 
  All the children nodes including its parent will not trigger the tweet dialog to open if the exclude-click class is assigned to the parent

  Open single tweet dialog
  */
  const openTweet = (post, event) => {
    if(event == null) {
      openTweetHelper(post)
      return
    }
    var currentNode = event.target // Node which triggered the event
    var parentNode = currentNode.parentNode // Parent Node

    // Traverse through nodes backward (child -> parent -> grand parent and so on...)
    while (currentNode && parentNode) {
      // Should not open tweet dialog as the node contains 'exclude-click' class
      if (currentNode.classList && currentNode.classList.contains('exclude-click')) return

      // Break the loop as this is the last parent node for a post
      if (parentNode.classList && parentNode.classList.contains('main-post-container')) break

      // Update current node and parent node
      currentNode = parentNode
      parentNode = currentNode.parentNode
    }
    openTweetHelper(post)
  }

  const openTweetHelper = (post) => {
    setTweet(post)
    setIsScrollingDisabled(true)
    navigate(`${post._id}`)
  }

  // Close single tweet dialog
  const closeTweet = () => {
    setTweet(null)
    setIsScrollingDisabled(false)
    navigate('')
  }

  // Disable scroll on main screen where all tweets are shown, when single tweet dialog opens
  const handleScroll = (e) => {
    if (isScrollingDisabled) {
      e.preventDefault();
      containerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {

    // Fetch tweets in paginated fashion
    fetchMoreData()

    // Current URL Path
    const partsURL = location.pathname.split('/')

    // Checks if URL has tweet ID
    var tweetIdFromURL = ''
    if (partsURL.length == 4) tweetIdFromURL = partsURL[3]

    // Query tweet from backend and pass it to openTweet function, if URL has tweet ID
    if (tweetIdFromURL) {
      console.log(`Fetch tweet from Tweet ID provided in URL: ${tweetIdFromURL}`)
      getTweetById({
        variables: {
          tweetId: tweetIdFromURL
        }
      })
    }
  }, [location.pathname]);

  return (

    <div
      className={isScrollingDisabled ? 'home scroll-container-disabled' : 'home'}
      id="home"
      onScroll={handleScroll}

      ref={containerRef} >

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

        <div className="tweet-view-container">
          {
            tweet ? <Tweet tweet={tweet} key={tweet._id} closeTweet={closeTweet} /> : ""
          }
        </div>
      </div>

      <CreatePost />

      <InfiniteScroll
        dataLength={postList.length}
        next={fetchMoreData}
        hasMore={hasMoreDataToLoad}
        loader={
          <>
            <PostSkeleton />
            {/* <PostSkeleton />
            <PostSkeleton /> */}
          </>
        }
        scrollableTarget="home"
        endMessage={
          <p className="end-message" style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >

        {postList.length > 0 ? (
          postList.map((post) => {
            return <Post data={post} key={post._id} openTweet={openTweet} />;
          })
        )

          : (
            <>
              <PostSkeleton />
              {/* <PostSkeleton />
              <PostSkeleton /> */}
            </>
          )}
      </InfiniteScroll>
    </div>

  );
}

export default Home;
