import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { CurrentUser } from '../Services/UserService'
import { useEffect, useState} from 'react'
import { useRecoilState } from 'recoil'
import { loginState } from '../State/atoms/loginState'




function ProtectedRoute() {

    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
    const [status,setStatus] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    
    useEffect(() => {

        setStatus(true)
        console.log('protected route')


    }, [])


    if (!status) {
        return <Navigate to={"/join"} />

    }
    else{
        return <Outlet />

    }
    

}

export default ProtectedRoute