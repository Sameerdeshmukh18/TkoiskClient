import React, { useState } from "react";
import "./Sidebar.css";
import profilepic from "../../Assets/profilepic.jpg"
import logo from "../../Assets/Zoomed_Logo.png"

function Sidebar() {
  const [isMorePopupOpen, setMorePopupOpen] = useState(false);

  const toggleMorePopup = () => {
    setMorePopupOpen(!isMorePopupOpen);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="" className="main-logo" />
      </div>
      <div className="menu">
        <ul>
          <li>
            <div>
              <i className="bi bi-house-door-fill"></i>
              Home
            </div>
          </li>
          <li>
            <div>
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
        <div className="profilepopup top-popup">
          {/* Popup content for "More" item goes here */}
          <p>This is the popup content for "More".</p>
          {/* You can add more elements as needed */}
        </div>
      )}
      <div className="profile-bar" onClick={toggleMorePopup}>
        <img src={profilepic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <span className="name">John Doe</span>
          <span className="username">{localStorage.getItem('username')}</span>

        </div>

        <i className="bi bi-three-dots"></i>
      </div>

    </div>
  );
}

export default Sidebar;
