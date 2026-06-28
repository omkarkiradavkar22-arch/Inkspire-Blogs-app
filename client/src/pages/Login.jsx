import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/neomorphism.css"; //  
import VideoBackground from "../components/VideoBackground";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validation
    if (!email.trim()) {
      setError("Please enter your email!");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://inkspire-blogs-app1.onrender.com/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      //  Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
    console.log("Saved user:", JSON.parse(localStorage.getItem("user")));
      //  Show success message
      setError("");
      
      //  Redirect to home
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || 
        "❌ Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  //  Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <VideoBackground isAuth={true}>
    <div className="auth-container">
      <div className="auth-card">
        {/*  Icon */}
        <div className="auth-icon" style={{color:"white"}}><i class="fa fa-unlock-alt" aria-hidden="true"></i></div>

        {/*  Title */}
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to your account</p>

        {/*  Error Message */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/*  Form */}
        <form onSubmit={handleSubmit}>
          {/*  Email Field */}
          <div className="form-group">
            <label className="form-label">
              <><i class="fa fa-envelope" aria-hidden="true"></i></>&nbsp; Email <span className="required">*</span>
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
              <><i class="fa fa-key" aria-hidden="true"></i></>&nbsp; Password <span className="required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="neo-input"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                disabled={isLoading}
                style={{ color: "white" }}
              >
                {showPassword ? (<i class="fa fa-eye" aria-hidden="true"></i>
)
                 : (<i class="fa fa-eye-slash" aria-hidden="true"></i>)
                 }
              </button>
            </div>
          </div>

          {/*  Forgot Password */}
          <div className="forgot-password">
  <Link to="/forgot-password">Forgot password?</Link>
</div>

          {/*  Login Button */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              <>
               Login<i class="fa fa-sign-in" aria-hidden="true"></i>
              </>
            )}
          </button>
        </form>

        {/*  Footer - Register Link */}
        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
    </VideoBackground>
  );
}

export default Login;
