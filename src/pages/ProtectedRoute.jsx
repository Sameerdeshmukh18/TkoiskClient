import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { authenticate } from '../Services/UserService'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { loginState } from '../State/atoms/loginState'


function ProtectedRoute() {
    const nav = useNavigate();
    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)

    useEffect(() => {

        const checkAuthenticate = async () => {
            const status = await authenticate()
            if (status === true) {

                setisLoggedIn(true)
            }
            else{
                nav("/join")
            }
        }
        checkAuthenticate()

    }, [])

    if (isLoggedIn) {
        return <Outlet />
    }

}

export default ProtectedRoute