import React from 'react'
import "./ProfileMoreActions.css"
import { useNavigate } from 'react-router-dom';
import { loginState } from '../../State/atoms/loginState'
import { useRecoilState } from 'recoil'

function ProfileMoreActions() {

    const navigate = useNavigate();
    const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)

    const handleLogout = () => {
        localStorage.clear();
        setisLoggedIn(false);
        window.location.reload(false);
        
    }

    return (
        <div className="profilepopup top-popup">
            <div className="logout" onClick={handleLogout}  >Logout</div>
        </div>
    )
}

export default ProfileMoreActions