import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ResetPassword.css"; // ✅ make sure this path matches your folder

function ResetPassword() {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const resetEmail = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!resetEmail) {
      alert("No email found. Please enter your email first.");
      navigate("/forgot");
    }
  }, [resetEmail, navigate]);

  const handleReset = (e) => {
    e.preventDefault();

    if (!newPass || !confirmPass) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPass.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const userIndex = existingUsers.findIndex((u) => u.email === resetEmail);

    if (userIndex !== -1) {
      existingUsers[userIndex].password = newPass;
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      localStorage.removeItem("resetEmail");
      alert("Password updated successfully! You can now log in.");
      navigate("/login");
    } else {
      alert("Something went wrong. Please try again.");
      navigate("/forgot");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        {/* Styled back button */}
        <button className="back-btn" onClick={() => navigate("/login")}>
          &larr; Back to Login
        </button>

        <div className="logo-container">
          <img src="/img/logo.png" alt="Logo" className="logo" />
        </div>   
        
        <h2 className="store-name">JAKE STORE</h2>
        <h3 className="subtitle">Reset Password</h3>
        <p className="text">
          Reset password for <b>{resetEmail}</b>
        </p>

        <form onSubmit={handleReset}>
          <label className="form-label">New Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="note">Must be at least 8 characters</p>

          <label className="form-label">Confirm Password</label>
          <div className="password-container">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
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

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
