import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate, Route } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../State/atoms/loginState";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
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

  const [checkAuth, { loading, error, data }]  = useLazyQuery(AUTHENTICATE);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if(data){
      if(data.authenticate){
        setisLoggedIn(true);
      }
    }
  }, [data, loading, error])

  if (loading) {
    return <div>Loading .......</div>;
  }
  if (error) {
    return <div>Error Occured</div>;
  }
  if(isLoggedIn){
    return <Component page={Page} />
  }else{
    return <Navigate to={"/join"} />
  }
}

export default ProtectedRoute;
