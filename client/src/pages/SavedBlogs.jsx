import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function SavedBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/users/saved-blogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Saved blogs:", res.data);
        
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load saved blogs");
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedBlogs();
  }, [navigate]);

  const handleUnsave = async (blogId) => {
    if (!window.confirm("Remove this blog from your saved list?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/blogs/${blogId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      alert(" Blog removed from saved list!");
    } catch (err) {
      console.error(err);
      alert(" Failed to remove blog");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "No content";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  if (isLoading) {
    return (
      <VideoBackground>
        <div className="saved-blogs-container">
          <div className="saved-loading">
            <div className="spinner"></div>
            <div>Loading saved blogs...</div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  if (error) {
    return (
      <VideoBackground>
        <div className="saved-blogs-container">
          <div className="empty-saved" style={{ border: "2px solid #e74c3c" }}>
            <span className="emoji">⚠️</span>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="auth-btn" 
              onClick={() => window.location.reload()}
              style={{ maxWidth: "200px", margin: "0 auto" }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground>
      <div className="saved-blogs-container">
        <div className="saved-blogs-header" style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "30px 35px",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
          <i className="fa fa-bookmark" aria-hidden="true"></i>  Saved Blogs
            <span className="count" style={{
              background: "rgba(255,255,255,0.1)",
              padding: "4px 16px",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white"
            }}>
              {blogs.length}
            </span>
          </h1>
          <Link to="/">
            <button className="neumorphic-btn" style={{
              padding: "10px 24px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              cursor: "pointer"
            }}>
              <><i class="fa fa-home" aria-hidden="true"></i></>&nbsp;
 Back to Home
            </button>
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-saved" style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "80px 20px",
            textAlign: "center",
            color: "white"
          }}>
            <span className="emoji" style={{ fontSize: "60px", display: "block", marginBottom: "16px" }}>📭</span>
            <h2 style={{ fontSize: "24px", color: "white", marginBottom: "8px" }}>No Saved Blogs</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", marginBottom: "20px" }}>
              You haven't saved any blogs yet. Start exploring and save your favorites!
            </p>
            <Link to="/">
              <button className="auth-btn" style={{
                maxWidth: "200px",
                margin: "0 auto",
                padding: "14px 24px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px"
              }}>
                 Explore Blogs
              </button>
            </Link>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="saved-blog-card" style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "28px",
              marginBottom: "25px",
              transition: "all 0.3s ease"
            }}>
              <Link to={`/blog/${blog._id}`}>
              {blog.image && (
                <img
                  src={
                    blog.image.startsWith("http")
                      ? blog.image
                      : `http://localhost:5000${blog.image}`
                  }
                  alt={blog.title || "Blog"}
                  className="saved-blog-image"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "16px"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  />
                )}
                </Link>

              {blog.category && (
                <div className="blog-category-badge" style={{
                  display: "inline-block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  marginBottom: "10px"
                }}>
                   {blog.category}
                </div>
              )}

              <Link to={`/blog/${blog._id}`} className="saved-blog-title" style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "white",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "8px"
              }}>
                {blog.title || "Untitled Blog"}
              </Link>

              <div className="saved-blog-meta" style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "center",
                padding: "10px 0",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                margin: "10px 0",
                color: "rgba(255,255,255,0.7)"
              }}>
                <span> <><i class="fa fa-user" aria-hidden="true"></i></>&nbsp; <strong style={{ color: "white" }}>{blog.author?.username || "Unknown"}</strong></span>
                <span> <><i class="fa fa-calendar" aria-hidden="true"></i>
</>&nbsp;{formatDate(blog.createdAt)}</span>
                <span>❤️ <strong style={{ color: "white" }}>{blog.likes?.length || 0}</strong></span>
              </div>

              <p className="saved-blog-content" style={{
                color: "rgba(255,255,255,0.8)",
                lineHeight: "1.7",
                fontSize: "15px",
                margin: "12px 0 16px 0"
              }}>
                {truncateContent(blog.content)}
              </p>

              <div className="saved-blog-actions" style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
                alignItems: "center"
              }}>
                <Link to={`/blog/${blog._id}`}>
                  <button className="neumorphic-btn" style={{
                    padding: "8px 20px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    more<i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                  </button>
                </Link>

                <button
                  className="unsave-btn"
                  onClick={() => handleUnsave(blog._id)}
                  style={{
                    padding: "8px 20px",
                     background: "rgba(255, 25, 0, 0.9)",
                     color: "#ffffff",
                    border: "1px solid rgba(231,76,60,0.3)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  <i className="fa fa-bookmark" aria-hidden="true"></i>
 Remove Save
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </VideoBackground>
  );
}

export default SavedBlogs;

