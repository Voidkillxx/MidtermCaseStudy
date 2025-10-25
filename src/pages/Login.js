import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css"; 

function Login({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    handleLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>

          <div className="logo-container">
            <img src="/img/logo.png" alt="Logo" className="logo" />
          </div>

        <h2 className="store-name">JAKE STORE</h2>
        <h3 className="subtitle">Welcome Back!</h3>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="form-label">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn">Login</button>

          <div className="bottom-text">
            <Link to="/forgot">Forgot Password?</Link>
            <br />
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
