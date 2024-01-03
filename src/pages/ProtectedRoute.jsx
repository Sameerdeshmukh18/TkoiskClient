import React, { useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
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
            if(data.authenticate){
                setisLoggedIn(true)

            }
            else{
                console.log("authentication failed in else")
                nav("/join")

            }
            
        },
        onError : (error) => {
            console.log("authentication failed")
            nav("/join")
        }
    });


    if (isLoggedIn) {
        return <Outlet />
    }

}

export default ProtectedRoute