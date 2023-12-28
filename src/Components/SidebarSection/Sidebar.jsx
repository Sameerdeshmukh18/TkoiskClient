import React, { useState } from "react";
import "./Sidebar.css";
import profilepic from "../../Assets/profilepic.jpg"
import logo from "../../Assets/Zoomed_Logo.png"
import ProfileMoreActions from "./ProfileMoreActions";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [isMorePopupOpen, setMorePopupOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMorePopup = () => {
    setMorePopupOpen(!isMorePopupOpen);
  };

  const handleExplore = () => {
    navigate('/main/explore');
  }
  const handleHome = () => {
    navigate('/main/Home');
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="" className="main-logo" />
      </div>
      <div className="menu">
        <ul>
          <li>
            <div onClick={handleHome}>
              <i className="bi bi-house-door-fill"></i>
              Home
            </div>
          </li>
          <li>
            <div onClick={handleExplore} >
              <i className="bi bi-search"></i>
              Explore
            </div>
          </li>
          <li>
            <div>
              <i className="bi bi-bell"></i>
              Notifications
            </div>
          </li>
          <li>
            <div>
              <i className="bi bi-envelope"></i>
              Messages
            </div>
          </li>
          <li>
            <div>
              <i className="bi bi-person"></i>
              Profile
            </div>
          </li>
          <li>
            <div>
              <i className="bi bi-three-dots"></i>
              More
            </div>
          </li>
        </ul>
      </div>
      {isMorePopupOpen && (

        <ProfileMoreActions />

      )}
      <div className="profile-bar" onClick={toggleMorePopup}>
        <img src={profilepic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <span className="name">{localStorage.getItem('name')}</span>
          <span className="username">@{localStorage.getItem('username')}</span>
        </div>
        <i className="bi bi-three-dots"></i>
      </div>

    </div>
  );
}

export default Sidebar;
