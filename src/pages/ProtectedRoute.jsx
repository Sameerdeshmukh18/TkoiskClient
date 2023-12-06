import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { CurrentUser } from '../Services/UserService'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { loginState } from '../State/atoms/loginState'
import Join from './Join/Join'

function ProtectedRoute() {

    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
    const [status, setStatus] = useState(false);
    const [isLoading, setisLoading] = useState(false)
    const nav = useNavigate();

    useEffect(() => {
        setisLoggedIn(true);
    }, [isLoggedIn])


    if (!isLoggedIn) {
        return nav("/join");
    }
    else {
        return <Outlet />

    }


}

export default ProtectedRoute