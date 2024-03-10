import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate, Route } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../State/atoms/loginState";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import client from "../apolloClient";
import LoadingPage from "./LoadingPage/LoadingPage";
import ApolloAPI from "../ApiCllient";

function ProtectedRoute(props) {
  const { Component, Page } = props;
  const [loadingPage,setLoadingPage] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState);

  const checkAuthentication = async () => {
    const response = await new ApolloAPI().client.query({
      query: gql`
      query Query {
        authenticate
      }
      `
    });
    if(response.data) {
      if(response.data.authenticate) return true
      return false
    }
    return false
  }

  useEffect(() => {
    checkAuthentication()
      .then((loginState) => {
        setisLoggedIn(loginState)
        setTimeout(() => {
          setLoadingPage(false)
        }, 1000)
      })
      .catch((err) => {
        console.log(`Error: ${err}`)
      })
    
  }, [])

  if (loadingPage) {
    return <LoadingPage/>;
  }

  return (
    
    <>{isLoggedIn ? <Component page={Page} /> : <Navigate to="/join" />}</>

  );
}

export default ProtectedRoute;
