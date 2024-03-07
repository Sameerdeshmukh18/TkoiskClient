import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate, Route } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../State/atoms/loginState";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import client from "../apolloClient";
import LoadingPage from "./LoadingPage/LoadingPage";


function ProtectedRoute(props) {
  const { Component, Page } = props;
  const [loadingPage,setLoadingPage] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState);

  useEffect(() => {
    
    const checkAuthentication = async () => {
      try {
        // Make a GraphQL query to check authentication status
        const { data } = await client.query({
          query: gql`
          query Query {
            authenticate
          }
          `
        });

        setisLoggedIn(data.authenticate);
        setTimeout(()=>{
          setLoadingPage(false);
        },1000)
        
      } catch (error) {
        console.error('Error checking authentication:', error);
        setTimeout(()=>{
          setLoadingPage(false);
        },1000)
      }
    };

    checkAuthentication();
    
  }, [])

  if (loadingPage) {
    return <LoadingPage/>;
  }

  return (
    
    <>{isLoggedIn ? <Component page={Page} /> : <Navigate to={"/join"} />}</>

  );
}

export default ProtectedRoute;
