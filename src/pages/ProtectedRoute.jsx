import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { authenticate } from '../Services/UserService'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { loginState } from '../State/atoms/loginState'
import { useQuery, gql } from '@apollo/client'


function ProtectedRoute() {
    const nav = useNavigate();
    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
    const AUTHENTICATE = gql`query Query {
        authenticate
      }`;
    const { data } = useQuery(AUTHENTICATE, {
        onCompleted : (data) => {
            setisLoggedIn(true)
        },
        onError : (error) => {
            nav("/join")
        }
    });

    // useEffect(async () => {
    //     if (data) {
    //         setisLoggedIn(true)
    //     }
    //     else{
    //         nav("/join")
    //     }
    // }, [])

    if (isLoggedIn) {
        return <Outlet />
    }

}

export default ProtectedRoute