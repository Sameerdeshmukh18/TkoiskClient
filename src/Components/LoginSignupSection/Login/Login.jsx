import { useState } from "react"
import { useRecoilState } from 'recoil'
import "./Login.css"
import symbol from "../../../Assets/symbol-bgr.png"
import { CurrentUser, loginUser } from "../../../Services/UserService";
import { loginState } from '../../../State/atoms/loginState'
import { Link, useNavigate } from 'react-router-dom'

function Login() {

  const [credentials, setcredentials] = useState({ email: "", password: "" });
  const [isLoggedIn, setisLoggedIn] = useRecoilState(loginState)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(credentials.email, credentials.password)
    const json = await response.json()
    if (json.accessToken) {
      sessionStorage.setItem('authToken', json.accessToken);
      const userDetails = await CurrentUser();
      localStorage.setItem('username', userDetails.username);
      localStorage.setItem('email', userDetails.email);
      localStorage.setItem('user_id', userDetails.id);
      setisLoggedIn(true);
      navigate("/main")
    }
  }
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="App">
      <div className="login-container">
        <div className="floating-icon">
          <img src={symbol} alt="" />
        </div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input className="login-email" type="email" placeholder="Email" name="email" value={credentials.email} onChange={onChange} required />
          <input className="login-password" type="password" placeholder="Password" name="password" value={credentials.password} onChange={onChange} required />
          <button type="submit">Log In</button>
        </form>
        <div className="extra-links">
          <Link to={"/join/forgotpwd"} >Forgot Password</Link>
          <span>|</span>
          <Link to={"/join/signup"} >Register Here</Link>
        </div>
      </div>
    </div>
  )
}

export default Login