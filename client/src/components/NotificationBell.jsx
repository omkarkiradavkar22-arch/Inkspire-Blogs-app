import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/neomorphism.css";

function NotificationBell({ pageMode = false }) {
  const navigate = useNavigate();
 
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://inkspire-blogs-app1.onrender.com/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unreadNotifications = res.data.notifications.filter(n => !n.read);
      setNotifications(unreadNotifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log("Fetch notifications error:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://inkspire-blogs-app1.onrender.com/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://inkspire-blogs-app1.onrender.com/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotificationClick = async (notif) => {
    await markAsRead(notif._id);
    setIsOpen(false);

    const blogId = notif.blogId?._id || notif.blogId;
    const commentId = notif.commentId?._id || notif.commentId;

    if (!blogId) {
      console.error("Blog ID not found");
      return;
    }

    if ((notif.type === "reply" || notif.type === "comment") && commentId) {
      navigate(`/blog/${blogId}?comment=${commentId}`);
    } else {
      navigate(`/blog/${blogId}`);
    }
  };

  const handleReplyFromNotification = async (notif, e) => {
    e.stopPropagation();
    
    const blogId = notif.blogId?._id || notif.blogId;
    const commentId = notif.commentId?._id || notif.commentId;
    
    if (commentId) {
      await markAsRead(notif._id);
      setIsOpen(false);
      navigate(`/blog/${blogId}?comment=${commentId}&reply=true`);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  };

  return (
    <div
  className={pageMode ? "" : "notification-wrapper"}
  ref={dropdownRef}
>
      {!pageMode && (
        <button
          className="neo-nav-link"
          onClick={() => {
            if (window.innerWidth <= 768) {
              navigate("/notifications");
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          <i className="fa fa-bell"></i>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {(pageMode || isOpen) && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">No notifications</div>
          ) : (
            <div className="notification-list">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="notification-item unread"
                  style={{ cursor: "pointer" }}
                >
                  <div 
                    className="notification-main"
                    onClick={() => handleNotificationClick(notif)}
                    style={{ flex: 1, display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}
                  >
                    <img
                      src={
                        notif.sender?.profilePic ||
                        "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=40"
                      }
                      alt={notif.sender?.username}
                      className="notification-avatar"
                    />
                    <div className="notification-content" style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "13px", 
                        lineHeight: "1.4",
                        color: "var(--text-primary, #fff)",
                        wordBreak: "break-word"
                      }}>
                        {notif.message}
                      </p>
                      <span className="notification-time" style={{ fontSize: "11px", color: "var(--text-secondary, #888)" }}>
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <span className="notification-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4a6cf7", flexShrink: 0 }}></span>
                  </div>

                  {(notif.type === "comment" || notif.type === "reply") && (
                    <button
                      className="notification-reply-btn"
                      onClick={(e) => handleReplyFromNotification(notif, e)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        border: "1px solid rgba(74,108,247,0.3)",
                        background: "rgba(74,108,247,0.1)",
                        color: "#4a6cf7",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: "600",
                        marginRight: "10px",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(74,108,247,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(74,108,247,0.1)";
                      }}
                    >
                      <i className="fa fa-reply" aria-hidden="true"></i> Reply
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;