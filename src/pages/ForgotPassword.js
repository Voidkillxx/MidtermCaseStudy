import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = existingUsers.find((u) => u.email === email);

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (user) {
      localStorage.setItem("resetEmail", email);
      alert("Email found! You can now reset your password.");
      navigate("/reset");
    } else {
      alert("No account found with this email.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {/*  Styled back link (matches Register page) */}
        <div className="back">
          <Link to="/login">← Back to Login</Link>
        </div>

        <div className="logo-container">
          <img src="/img/logo.png" alt="Logo" className="logo" />
        </div>   

        <h2 className="store-name">JAKE STORE</h2>
        <h3 className="subtitle">Forgot Password</h3>
        <p className="text">Enter your email to reset your password</p>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Email Address</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="reset-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
