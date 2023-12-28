import React from 'react'
import "./Join.css"
import logo from "../.././Assets/Zoomed_Logo.png"
import {Link} from 'react-router-dom' 

function Join() {
  return (
    <div className='joincontainer'>
        <div className="logo-section">
          <img className="big-logo" src={logo} alt="" />
        </div>
        <div className="options-box">
          <h3>Join Today.</h3>
          <Link to={"/join/signup"}><button className="create-account-btn" type="submit">Create account</button></Link>
          <p>By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
          <h4>                    or                   </h4>
          <h5><b>Already have an account?</b></h5>
          <Link to={"/join/login"}><button className="create-account-btn" type="submit">Sign In</button></Link>
        </div>
    </div>
  )
}

export default Join