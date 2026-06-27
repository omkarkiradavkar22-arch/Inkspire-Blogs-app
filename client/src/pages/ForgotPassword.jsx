import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email!" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: email.trim() }
      );

      setMessage({ type: "success", text: res.data.message });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send reset link",
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
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to receive reset link</p>

          {message.text && (
            <div className={message.type === "success" ? "auth-success" : "auth-error"}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp; Email
              </label>
              <input
                type="email"
                className="neo-input"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>&nbsp; Send Reset Link
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

export default ForgotPassword;