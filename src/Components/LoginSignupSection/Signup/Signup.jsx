import React, { useState } from "react";
import {
  checkUsernameAvailability,
  createUser,
} from "../../../Services/UserService";
import "./Signup.css";
import { useRecoilState } from "recoil";
import { loginState } from "../../../State/atoms/loginState";
import symbol from "../../../Assets/symbol-bgr.png";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import client from "../../../apolloClient";

function Signup() {
  const [credentials, setcredentials] = useState({
    name: "",
    username: "",
    email: "",
    dob: "",
    password: "",
  });
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState);
  const [showAvailability, setshowAvailability] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [errMsg, seterrMsg] = useState(null);
  const navigate = useNavigate();

  const USERNAMEAVAILABILITY = gql`
    query Query($username: String!) {
      checkUsername(username: $username)
    }
  `;

  const REGISTERUSER = gql`
    mutation Register(
      $username: String!
      $email: String!
      $password: String!
      $name: String
      $dob: Date
    ) {
      register(
        username: $username
        email: $email
        password: $password
        name: $name
        dob: $dob
      ) {
        token
      }
    }
  `;
  const ME = gql`
  query Query {
    me {
      username
      name
      _id
    }
  }`;

  const [signup] = useMutation(REGISTERUSER, {
    onCompleted: async (data) => {
      console.log(data);
      const json = data.register;
      if (json.token) {
        sessionStorage.setItem("authToken", json.token);
        const { loading, error, data: userData } = await client.query({
          query: ME,
        });
        if (userData) {
          console.log(userData);
          localStorage.setItem('username', userData.me.username);
          localStorage.setItem('name', userData.me.name);
          localStorage.setItem('user_id', userData.me._id);
          setisLoggedIn(true);
          setisLoading(false);
          navigate("/main/home")
        }
        else {
          seterrMsg("something went wrong!")
        }
        
      } else {
        seterrMsg("something went wrong!");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();
    // const response = await createUser(credentials.name,credentials.username, credentials.email, credentials.dob, credentials.password)
    // const json = await response.json()
    await signup({
      variables: {
        name: credentials.name,
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        dob: Date.parse(credentials.dob),
      },
    });
  };
  const onChange = async (e) => {
    setisLoading(false);
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      const username = e.target.value;
      if (!username) {
        setshowAvailability(true);
      }
      const response = await client.query({
        query: USERNAMEAVAILABILITY,
        variables: {
          username: username,
        },
      });
      if (response.data.checkUsername === false) {
        setshowAvailability(false);
      } else {
        setshowAvailability(true);
      }
    }
  };

  return (
    <div className="App">
      <div className="signup-container">
        <div className="floating-icon">
          <img src={symbol} alt="" />
        </div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {errMsg !== null ? (
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle"></i>
              <div>{errMsg}</div>
            </div>
          ) : (
            errMsg
          )}
          <input
            className="signup-name"
            type="text"
            name="name"
            placeholder="Full Name"
            value={credentials.name}
            onChange={onChange}
            required
          />
          <input
            className="signup-email"
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={onChange}
            required
          />
          <input
            className="signup-username"
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={onChange}
            required
          />
          {credentials.username.length > 0 ? (
            showAvailability ? (
              <p className="success-text">
                <i className="bi bi-check2-circle"></i> Username is available
              </p>
            ) : (
              <p className="error-text">
                <i className="bi bi-person-fill-x"></i>Username is Already
                taken!
              </p>
            )
          ) : (
            <p></p>
          )}

          <div className="dob-container">
            <label htmlFor="dob">Date of Birth</label>
            <input
              className="signup-dob"
              type="date"
              id="dob"
              name="dob"
              value={credentials.dob}
              onChange={onChange}
              required
            />
          </div>
          <input
            className="signup-password"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={onChange}
            required
          />
          <button type="submit">
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="extra-links">
          <p>
            Already have an account? <Link to={"/join/login"}>Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
