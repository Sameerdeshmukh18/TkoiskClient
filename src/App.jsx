import "./App.css";
import Join from "./pages/Join/Join";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import ProtectedRoute from "./pages/ProtectedRoute";
import Signup from "./Components/LoginSignupSection/Signup/Signup";
import Login from "./Components/LoginSignupSection/Login/Login";
import { CurrentUser } from "./Services/UserService";
import { useRecoilState } from "recoil";
import { loginState } from "./State/atoms/loginState";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/join" element={<Join />} />
          <Route path="/join/signup" element={<Signup />} />
          <Route path="/join/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/main/home" element={<Main page={'home'} />} />
            <Route path='/main/explore' element={<Main page={'explore'} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
