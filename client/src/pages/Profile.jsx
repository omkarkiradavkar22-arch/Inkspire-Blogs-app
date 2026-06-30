import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";
import FollowersList from "../components/FollowersList";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "https://inkspire-blogs-app1.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile data:", res.data);
        setUser(res.data);
     

        //  Fetch followers & following count
        const followersRes = await axios.get(
          `https://inkspire-blogs-app1.onrender.com/api/follow/${res.data._id}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowersCount(followersRes.data.length || 0);

        const followingRes = await axios.get(
          `https://inkspire-blogs-app1.onrender.com/api/follow/${res.data._id}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowingCount(followingRes.data.length || 0);

      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <VideoBackground>
        <div className="edit-profile-container">
          <div className="edit-loading">
            <div className="spinner"></div>
            <div>Loading profile...</div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  if (!user) {
    return (
      <VideoBackground>
        <div className="edit-profile-container">
          <div className="empty-saved">
            <span className="emoji"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
</span>
            <h2>User not found</h2>
            <Link to="/">
              <button className="auth-btn" style={{ maxWidth: "200px", margin: "0 auto" }}>
                <i class="fa fa-home" aria-hidden="true"></i> Back to Home
              </button>
            </Link>
          </div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground>
      <div className="edit-profile-container">
        <div className="edit-profile-card" style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Link to={`/author/${user._id}`}>
            <div className="profile-pic-preview">
              <img
                src={
                  user.profilePic
                    ? user.profilePic.startsWith("http")
                      ? user.profilePic
                      : `https://inkspire-blogs-app1.onrender.com${user.profilePic}`
                    : "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=120"
                }
                alt={user.username}
                className="profile-pic-avatar"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                }}
              />
            </div>
            </Link>
            <h1 className="edit-profile-title" style={{ color: "white", fontSize: "28px" }}>
              <i class="fa fa-user-circle-o" aria-hidden="true"></i>
 {user.username}
            </h1>

          <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "30px", 
              marginTop: "12px" 
            }}>
              <div className="follows"
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => setShowFollowers(true)}
              >
                <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                  {followersCount || 0}
                </span>
                <span style={{ color: "rgba(255, 255, 255, 0.73)", fontSize: "19px", display: "block" }}>
                  Followers
                </span>
              </div>
              <div className="followings"
                    style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => setShowFollowing(true)}
              >
                <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                  {followingCount || 0}
                </span>
                <span style={{ color: "rgba(255,255,255,0.73)", fontSize: "19px", display: "block" }}>
                  Following
                </span>
              </div>
            </div>
                      {showFollowers && (
                <FollowersList 
                  userId={user._id} 
                  type="followers" 
                  onClose={() => setShowFollowers(false)} 
                />
              )}
              {showFollowing && (
                <FollowersList 
                  userId={user._id} 
                  type="following" 
                  onClose={() => setShowFollowing(false)} 
                />
              )}
            <br />
            
            <p style={{ color: "rgba(255,255,255,0.6)" }}>{user.email}</p>
          </div>

          <div className="current-username" style={{
            background: "rgba(255,255,255,0.08)",
            padding: "12px 20px",
            borderRadius: "12px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
          }}>


            <label style={{ color: "rgba(255,255,255,0.7)" }}><><i class="fa fa-calendar" aria-hidden="true"></i>
</>&nbsp; Joined:</label>
            <span style={{ color: "white", fontWeight: "bold" }}>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="current-username" style={{
            background: "rgba(255,255,255,0.08)",
            padding: "12px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
          }}>
            <label style={{ color: "rgba(255,255,255,0.7)" }}><><i class="fa fa-bookmark" aria-hidden="true"></i>
</>&nbsp; Saved Blogs:</label>
            <span style={{ color: "white", fontWeight: "bold" }}>
              {user.savedBlogs?.length || 0}
            </span>
          </div>

          <div style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <Link to="/profile/edit" style={{ flex: 1 }}>
              <button className="submit-btn" style={{
                width: "100%",
                padding: "14px 24px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}>
                <i class="fa fa-pencil" aria-hidden="true"></i>
 Edit Profile
              </button>
            </Link>
            <Link to="/myblogs" style={{ flex: 1 }}>
              <button className="submit-btn" style={{
                width: "100%",
                padding: "14px 24px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}>
                <i class="fa fa-book" aria-hidden="true"></i>
 My Blogs
              </button>
            </Link>
          </div>

          <div style={{ marginTop: "12px" }}>
            <Link to="/">
              <button className="cancel-btn" style={{
                width: "100%",
                padding: "14px 24px",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}>
                <i class="fa fa-home" aria-hidden="true"></i>
 Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </VideoBackground>
  );
}

export default Profile;