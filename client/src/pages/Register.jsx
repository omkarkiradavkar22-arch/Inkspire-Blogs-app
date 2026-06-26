import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/neomorphism.css"; //  CSS import
import VideoBackground from "../components/VideoBackground";

function Register() {
  const navigate = useNavigate();

  //  Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "",
    color: "",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    }
  });

  //  Password Strength Checker
  useEffect(() => {
    const checkStrength = (pass) => {
      const requirements = {
        length: pass.length >= 8,
        uppercase: /[A-Z]/.test(pass),
        lowercase: /[a-z]/.test(pass),
        number: /[0-9]/.test(pass),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      };

      const metCount = Object.values(requirements).filter(Boolean).length;

      let score = 0;
      let text = "";
      let color = "";

      if (pass.length === 0) {
        text = "";
        color = "";
      } else if (metCount <= 2) {
        score = 1;
        text = "Weak";
        color = "#e74c3c";
      } else if (metCount <= 3) {
        score = 2;
        text = "Medium";
        color = "#f39c12";
      } else if (metCount <= 4) {
        score = 3;
        text = "Strong";
        color = "#27ae60";
      } else {
        score = 4;
        text = "Very Strong";
        color = "#2ecc71";
      }

      setPasswordStrength({
        score,
        text,
        color,
        requirements,
      });
    };

    checkStrength(password);
  }, [password]);

  //  Handle Register Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validation
    if (!username.trim()) {
      setError("Please enter a username!");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters!");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email!");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address!");
      return;
    }
    if (!password.trim()) {
      setError("Please create a password!");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }
      );

      console.log(res.data);

      //  Success - Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || 
        "❌ Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  //  Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  //  Get password strength bar width
  const getStrengthWidth = () => {
    if (password.length === 0) return "0%";
    const percent = (passwordStrength.score / 4) * 100;
    return `${percent}%`;
  };

  return (
     <VideoBackground isAuth={true}>
    <div className="auth-container">
      <div className="auth-card">
        {/*  Icon */}
        <div className="auth-icon" style={{ color: "white" }}><i class="fa fa-id-badge" aria-hidden="true"></i>
</div>

        {/*  Title */}
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our blog community</p>

        {/*  Error Message */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/*  Form */}
        <form onSubmit={handleSubmit}>
          {/*  Username Field */}
          <div className="form-group">
            <label className="form-label">
              <><i class="fa fa-user-o" aria-hidden="true"></i>
</>&nbsp; Username <span className="required">*</span>
            </label>
            <input
              type="text"
              className="neo-input"
              placeholder="Choose a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
            {username && username.length < 3 && (
              <div style={{ 
                fontSize: "12px", 
                color: "#e74c3c", 
                marginTop: "4px" 
              }}>
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
 Username must be at least 3 characters
              </div>
            )}
          </div>

          {/*  Email Field */}
          <div className="form-group">
            <label className="form-label">
              <><i class="fa fa-envelope-o" aria-hidden="true"></i>
</>&nbsp; Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className="neo-input"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/*  Password Field */}
          <div className="form-group">
            <label className="form-label">
              <i class="fa fa-key" aria-hidden="true"></i>
 Password <span className="required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="neo-input"
                placeholder="Create a password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                disabled={isLoading}
                style={{ color: "white" }}
              >
                {showPassword ?(
                  <i class="fa fa-eye" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                )}
              </button>
            </div>
            {/* <i class="fa fa-refresh" aria-hidden="true"></i> refresh mark*/}

            {/*  Password Strength Indicator */}
            {password && (
              <>
                <div className="password-strength">
                  <div className="password-strength-bar">
                    <div 
                      className="fill" 
                      style={{ 
                        width: getStrengthWidth(),
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span 
                    className="password-strength-text"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.text}
                  </span>
                </div>

                {/*  Password Requirements */}
                <div className="password-requirements" style={{ color: "white" }}>
                  <span className={`req ${passwordStrength.requirements.length ? 'met' : 'unmet'}`}>
                   8+ chars{passwordStrength.requirements.length ? (<i class="fa fa-check-square-o" aria-hidden="true"></i>) : (<i class="fa fa-times" aria-hidden="true"></i>)} ,
                  </span>
                  <span className={`req ${passwordStrength.requirements.uppercase ? 'met' : 'unmet'}`}>
                    Uppercase{passwordStrength.requirements.uppercase ? (<i class="fa fa-check-square-o" aria-hidden="true"></i>) : (<i class="fa fa-times" aria-hidden="true"></i>)} , 
                  </span>
                  <span className={`req ${passwordStrength.requirements.lowercase ? 'met' : 'unmet'}`}>
                    Lowercase{passwordStrength.requirements.lowercase ? (<i class="fa fa-check-square-o" aria-hidden="true"></i>) : (<i class="fa fa-times" aria-hidden="true"></i>)} ,
                  </span>
                  <span className={`req ${passwordStrength.requirements.number ? 'met' : 'unmet'}`}>
                    Number{passwordStrength.requirements.number ? (<i class="fa fa-check-square-o" aria-hidden="true"></i>) : (<i class="fa fa-times" aria-hidden="true"></i>)} ,
                  </span>
                  <span className={`req ${passwordStrength.requirements.special ? 'met' : 'unmet'}`}>
                    Special{passwordStrength.requirements.special ? (<i class="fa fa-check-square-o" aria-hidden="true"></i>) : (<i class="fa fa-times" aria-hidden="true"></i>)} 
                  </span>
                </div>
              </>
            )}
          </div>

          {/*  Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">
              <i class="fa fa-key" aria-hidden="true"></i>
 Confirm Password <span className="required">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="neo-input"
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <div style={{ 
                fontSize: "12px", 
                color: "#e74c3c", 
                marginTop: "4px" 
              }}>
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
 Passwords do not match
              </div>
            )}
            {confirmPassword && password === confirmPassword && (
              <div style={{ 
                fontSize: "12px", 
                color: "#27ae60", 
                marginTop: "4px" 
              }}>
                 Passwords match
              </div>
            )}
          </div>

          {/*  Register Button */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i class="fa fa-address-book-o" aria-hidden="true"></i>Register
              </>
            )}
          </button>
        </form>

        {/*  Footer - Login Link */}
        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
    </VideoBackground>
  );
}

export default Register;