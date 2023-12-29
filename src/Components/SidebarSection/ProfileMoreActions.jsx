import React from 'react'
import "./ProfileMoreActions.css"
import { useNavigate } from 'react-router-dom';

function ProfileMoreActions() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/join");
    }

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
    }

    return (
        <div className="profilepopup top-popup">
            <div className="logout" onClick={handleLogout}  >Logout</div>
        </div>
    )
}

export default ProfileMoreActions