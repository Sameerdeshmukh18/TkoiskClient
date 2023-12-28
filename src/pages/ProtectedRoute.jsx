import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { authenticate } from '../Services/UserService'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { loginState } from '../State/atoms/loginState'
import { useQuery, gql } from '@apollo/client'
import Join from "../pages/Join/Join"


function ProtectedRoute() {
    const nav = useNavigate();
    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
    const AUTHENTICATE = gql`query Query {
        authenticate
      }`;
    const { data } = useQuery(AUTHENTICATE, {
        onCompleted : (data) => {
            if(data.authenticate){
                setisLoggedIn(true)

            }
            else{
                nav("/join")

            }
            
        },
        onError : (error) => {
            nav("/join")
        }
    });


    if (isLoggedIn) {
        return <Outlet />
    }

}

export default ProtectedRoute