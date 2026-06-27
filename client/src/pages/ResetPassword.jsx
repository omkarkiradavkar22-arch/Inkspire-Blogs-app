import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setMessage({ type: "error", text: "Please enter a password!" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: password.trim() }
      );

      setMessage({ type: "success", text: res.data.message });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VideoBackground isAuth={true}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon" style={{color:"white"}}>
            <i className="fa fa-key" aria-hidden="true"></i>
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password</p>

          {message.text && (
            <div className={message.type === "success" ? "auth-success" : "auth-error"}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <i className="fa fa-lock" aria-hidden="true"></i>&nbsp; New Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="neo-input"
                  placeholder="Enter new password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{color:"white"}}
                >
                  {showPassword ? (
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp; Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="neo-input"
                placeholder="Confirm new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fa fa-check" aria-hidden="true"></i>&nbsp; Reset Password
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">
              <i className="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </VideoBackground>
  );
}

export default ResetPassword;