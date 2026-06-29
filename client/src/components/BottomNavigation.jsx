import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

function BottomNavigation() {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const token = localStorage.getItem("token");

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        "https://inkspire-blogs-app1.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  // Hide Bottom Navigation when user is not logged in
  if (!token) return null;

  return (
    <div className="bottom-nav">
      <Link
        to="/"
        className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
      >
        <i className="fa fa-home"></i>
      </Link>

      <Link
        to="/create"
        className={`bottom-nav-item ${isActive("/create") ? "active" : ""}`}
      >
        <i className="fa fa-pencil-square-o"></i>
      </Link>

      <Link
        to="/notifications"
        className={`bottom-nav-item ${
          isActive("/notifications") ? "active" : ""
        }`}
      >
        {/* <div style={{ position: "relative" }}> */}
        <div className="bottom-nav-bell">
          <i className="fa fa-bell"></i>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount}
            </span>
          )}
        </div>
      </Link>

      <Link
        to="/saved-blogs"
        className={`bottom-nav-item ${
          isActive("/saved-blogs") ? "active" : ""
        }`}
      >
        <i className="fa fa-bookmark"></i>
      </Link>

      <button
  className="bottom-nav-item"
  onClick={toggleTheme}
>
  <i className={`fa ${darkMode ? "fa-sun-o" : "fa-moon-o"}`}></i>
</button>

      <Link
        to="/profile"
        className={`bottom-nav-item ${
          isActive("/profile") ? "active" : ""
        }`}
      >
        <i className="fa fa-user"></i>
      </Link>
    </div>
  );
}

export default BottomNavigation;