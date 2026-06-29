import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/neomorphism.css";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="neo-navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        Inkspire Blog<span>App</span>
      </Link>

      <div className="mobile-auth-actions">

  {token ? (
    <button
      className="mobile-auth-btn logout"
      onClick={handleLogout}
    >
      <i className="fa fa-sign-out"></i>
    </button>
  ) : (
    <>
      <Link to="/login" className="mobile-auth-btn">
        Login
      </Link>

      <Link to="/register" className="mobile-auth-btn">
        Register
      </Link>
    </>
  )}

</div>

      <button className="navbar-hamburger" onClick={toggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className={`neo-nav-link ${isActive("/") ? "active" : ""}`}
          onClick={closeMenu}
        >
          <i className="fa fa-home" aria-hidden="true"></i> Home
        </Link>

        {/*  Dark Mode Toggle Button with Font Awesome Icons */}
        <button
          className="neo-nav-link"
          onClick={toggleTheme}
          style={{
            background: darkMode ? "rgba(58, 58, 58, 0.5)" : "",
          }}
        >
          {darkMode ? (
            <>
              <i className="fa fa-sun-o" aria-hidden="true"></i> Light
            </>
          ) : (
            <>
              <i className="fa fa-moon-o" aria-hidden="true"></i> Dark
            </>
          )}
        </button>

        {token && (
          <>
            <Link
              to="/create"
              className={`neo-nav-link ${isActive("/create") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Create Blog
            </Link>

            <Link
              to="/myblogs"
              className={`neo-nav-link ${isActive("/myblogs") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-book" aria-hidden="true"></i> My Blogs
            </Link>

            <Link
              to="/saved-blogs"
              className={`neo-nav-link ${isActive("/saved-blogs") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-bookmark" aria-hidden="true"></i> Saved
            </Link>

            <Link
              to="/profile"
              className={`neo-nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-user" aria-hidden="true"></i> Profile
            </Link>

            <NotificationBell />

            <button
              onClick={handleLogout}
              className="neo-nav-link logout"
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link
              to="/login"
              className={`neo-nav-link ${isActive("/login") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-sign-in" aria-hidden="true"></i> Login
            </Link>

            <Link
              to="/register"
              className={`neo-nav-link ${isActive("/register") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-user-plus" aria-hidden="true"></i> Register
            </Link>

            <Link
              to="/profile"
              className={`neo-nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="fa fa-user" aria-hidden="true"></i> Profile
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
