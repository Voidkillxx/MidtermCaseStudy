import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPass) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const userExists = existingUsers.some((u) => u.email === email);

    if (userExists) {
      alert("User already exists.");
      return;
    }

    existingUsers.push({ email, password, role: "user" });
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
    alert("Registration successful! You can now log in.");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <button className="back-btn" onClick={() => navigate("/login")}>
          ← Back to Login
        </button>

        <div className="logo-container">
          <img src="/img/logo.png" alt="Logo" className="logo" />
        </div>       

        <h2 className="store-name">JAKE STORE</h2>
        <h3 className="subtitle">Create Account</h3>

        <form onSubmit={handleRegister}>
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

          <label className="form-label">Confirm Password</label>
          <div className="password-container">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn">Register</button>

          <div className="bottom-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
