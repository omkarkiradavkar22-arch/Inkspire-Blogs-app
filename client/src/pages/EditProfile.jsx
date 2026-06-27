import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState("");
  const [profilePicName, setProfilePicName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(res.data.username);
        if (res.data.profilePic) {
          setCurrentProfilePic(res.data.profilePic);
        }
      } catch (error) {
        console.log(error);
        setMessage({
          type: "error",
          text: "❌ Failed to load profile",
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicName(file.name);
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePic(null);
    setProfilePicName("");
    document.getElementById("profile-pic-input").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage({ type: "error", text: "Please enter a username!" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("username", username.trim());

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.username = username.trim();
      localStorage.setItem("user", JSON.stringify(user));

      setMessage({ type: "success", text: "Profile Updated Successfully!" });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.log(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Update Failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <VideoBackground>
      <div className="edit-profile-container" style={{ padding: "30px 20px" }}>
        <div className="edit-profile-card" style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "white",
            textAlign: "center",
            marginBottom: "30px"
          }}>
            <><i class="fa fa-user-circle-o" aria-hidden="true"></i></>&nbsp; Edit Profile
          </h1>

          {message.text && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
              textAlign: "center",
              background: message.type === "success" ? "rgba(39,174,96,0.15)" : "rgba(231,76,60,0.15)",
              color: message.type === "success" ? "#27ae60" : "#e74c3c",
              border: `1px solid ${message.type === "success" ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)"}`
            }}>
              {message.text}
            </div>
          )}

          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <img
              src={
                getProfileImageUrl(currentProfilePic) ||
                "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=120"
              }
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
              }}
            />
            <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "14px" }}>
              {/* {profilePic ? "📸 New Photo Selected" : "📸 Current Photo"} */}


               {profilePic ? (
                  <>
                    <i class="fa fa-picture-o" aria-hidden="true"></i>&nbsp; New Photo Selected 
                  </>
                ) : (
                  <>
                    <i class="fa fa-picture-o" aria-hidden="true"></i>&nbsp; Current Photo 
                  </>
                )}

            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "22px" }}>
              <label style={{
                display: "block",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.25)";
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.background = "rgba(255,255,255,0.06)";
                }}
              />
            </div>

            {/*  File Upload - Without FileInput Component */}
            <div className="form-group" style={{ marginBottom: "22px" }}>
              <label style={{
                display: "block",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                 Profile Picture
              </label>

              <div className="file-upload-wrapper">
                <input
                  id="profile-pic-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  disabled={isSubmitting}
                  className="file-upload-input"
                />
                
                <label htmlFor="profile-pic-input" className="file-upload-label">
                  <div className="file-upload-icon">
                    {/* {profilePic ? "🖼️" : "📤"} */}

                    {profilePic ? (
                  <>
                    <i className="fa fa-exchange" aria-hidden="true"></i>
                  </>
                ) : (
                  <>
                    <i className="fa fa-upload" aria-hidden="true"></i>
                  </>
                )}
                  </div>
                  <div className="file-upload-text">
                    <span className="file-upload-main">
                      {profilePicName || "Choose profile picture"}
                    </span>
                    <span className="file-upload-sub">
                      {profilePicName ? `${(profilePic.size / 1024).toFixed(1)} KB` : "PNG, JPG, WEBP up to 5MB"}
                    </span>
                  </div>
                  <div className="file-upload-status">
                    {profilePicName ? " Selected" : "Browse"}
                  </div>
                </label>
              </div>

              {/*  Show remove button if file selected */}
              {profilePicName && (
                <button
                  type="button"
                  onClick={handleRemoveProfilePic}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background: "rgba(231,76,60,0.12)",
                    color: "#ff6b6b",
                    border: "1px solid rgba(231,76,60,0.2)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(231,76,60,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(231,76,60,0.12)";
                  }}
                >
                  ✕ Remove File
                </button>
              )}
            </div>

            <div style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px"
            }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                }}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.color = "#ff6b6b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.03)";
                  e.target.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                ↩ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </VideoBackground>
  );
}

export default EditProfile;