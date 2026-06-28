import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function FollowersList({ userId, type, onClose }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = type === "followers" 
          ? `https://inkspire-blogs-app1.onrender.com/api/follow/${userId}/followers`
          : `https://inkspire-blogs-app1.onrender.com/api/follow/${userId}/following`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Users data:", res.data);
        setUsers(res.data);
        setError("");
      } catch (error) {
        console.error("Fetch users error:", error);
        
        // ✅ Handle 403 Forbidden
        if (error.response?.status === 403) {
          setError("🔒 You must follow this user to see their list");
        } else if (error.response?.status === 401) {
          setError("🔒 Please login to see this list");
        } else {
          setError("Failed to load list");
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type]);

  if (isLoading) {
    return (
      <div className="followers-modal" onClick={onClose}>
        <div className="followers-content" onClick={(e) => e.stopPropagation()}>
          <div className="followers-header">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error State - 403 Forbidden दाखवा
  if (error) {
    return (
      <div className="followers-modal" onClick={onClose}>
        <div className="followers-content" onClick={(e) => e.stopPropagation()}>
          <div className="followers-header">
            <h3>{type === "followers" ? "Followers" : "Following"}</h3>
            <button className="followers-close" onClick={onClose}>✕</button>
          </div>
          <div className="followers-list">
            <p style={{ 
              color: "#e74c3c", 
              textAlign: "center", 
              padding: "40px 20px",
              fontSize: "16px"
            }}>
              <i className="fa fa-lock" aria-hidden="true" style={{ fontSize: "24px", display: "block", marginBottom: "10px" }}></i>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Empty State
  if (users.length === 0) {
    return (
      <div className="followers-modal" onClick={onClose}>
        <div className="followers-content" onClick={(e) => e.stopPropagation()}>
          <div className="followers-header">
            <h3>{type === "followers" ? "Followers" : "Following"}</h3>
            <button className="followers-close" onClick={onClose}>✕</button>
          </div>
          <div className="followers-list">
            <p className="followers-empty" style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
              No {type} yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success - Show Users
  return (
    <div className="followers-modal" onClick={onClose}>
      <div className="followers-content" onClick={(e) => e.stopPropagation()}>
        <div className="followers-header">
          <h3>{type === "followers" ? "Followers" : "Following"}</h3>
          <button className="followers-close" onClick={onClose}>✕</button>
        </div>
        <div className="followers-list">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/author/${user._id}`}
              className="follower-item"
              onClick={onClose}
            >
              <img
                src={
                  user.profilePic
                    ? `https://inkspire-blogs-app1.onrender.com${user.profilePic}`
                    : "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=40"
                }
                alt={user.username}
              />
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowersList;
