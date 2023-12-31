import React from 'react'
import "./ProfileMoreActions.css"
import { useNavigate } from 'react-router-dom';

function ProfileMoreActions() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    }

    const logout = () => {
        localStorage.clear();
        window.location.reload(false);
    }

    return (
        <div className="profilepopup top-popup">
            <div className="logout" onClick={handleLogout}  >Logout</div>
        </div>
    )
}

export default ProfileMoreActions