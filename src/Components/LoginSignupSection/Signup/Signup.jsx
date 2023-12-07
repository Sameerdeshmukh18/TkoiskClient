import React, { useState } from 'react'
import { createUser } from "../../../Services/UserService"
import "./Signup.css"
import { useRecoilState } from 'recoil'
import { loginState } from '../../../State/atoms/loginState'
import symbol from "../../../Assets/symbol-bgr.png"
import { Link, useNavigate } from 'react-router-dom'


function Signup() {
  const [credentials, setcredentials] = useState({ username: "", email: "", dob: "", password: "" });
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
  const [isLoading, setisLoading] = useState(false)
  const [errMsg, seterrMsg] = useState(null)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setisLoading(true)
    e.preventDefault();
    const response = await createUser(credentials.username, credentials.email, credentials.dob, credentials.password)
    const json = await response.json()
    if (json.authToken) {
      sessionStorage.setItem('authToken', json.authToken);
      setisLoggedIn(true);
      navigate("/main")
      setisLoading(false)
    }
    else if (json.message) {
      seterrMsg(json.message)
      setisLoading(false)
    }
    else {
      seterrMsg("something went wrong!")

    }
  }
  const onChange = (e) => {
    setisLoading(false)
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="App">
      <div className="signup-container">
        <div className="floating-icon">
          <img src={symbol} alt="" />
        </div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
        {errMsg!==null?
          <div class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            {errMsg}
          </div>
        </div>:
          errMsg}
          <input className="signup-username" type="text" name="username" placeholder="Full Name" value={credentials.username} onChange={onChange} required />
          <input className="signup-email" type="email" name="email" placeholder="Email" value={credentials.email} onChange={onChange} required />
          <div className="dob-container">
            <label htmlFor="dob">Date of Birth</label>
            <input className="signup-dob" type="date" id="dob" name="dob" value={credentials.dob} onChange={onChange} required />
          </div>
          <input className="signup-password" type="password" name="password" placeholder="Password" value={credentials.password} onChange={onChange} required />
          <button type="submit">
            {isLoading ?
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              : "Sign Up"
            }


          </button>
        </form>
        <div className="extra-links">
          <p>Already have an account? <Link to={"/join/login"}>Login Here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup