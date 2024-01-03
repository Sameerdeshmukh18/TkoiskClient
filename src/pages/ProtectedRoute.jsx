import React, { useEffect } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../State/atoms/loginState";
import { useQuery, gql } from "@apollo/client";
import client from "../apolloClient";

function ProtectedRoute(props) {
  const { Component, Page } = props;
  const nav = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState);
  const AUTHENTICATE = gql`
    query Query {
      authenticate
    }
  `;

  const { loading, error, data } = useQuery(AUTHENTICATE);

  useEffect(() => {
    if (data) {
      if (data.authenticate) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
        console.log("protected useeffect");
        nav("/join");
      }
    }
  }, data);

  if (loading) {
    return <div>Loading ......</div>;
  } else {
    return <Component page={Page} />;
  }
}

export default ProtectedRoute;
