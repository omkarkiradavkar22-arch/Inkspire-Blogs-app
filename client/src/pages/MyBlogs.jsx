import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function MyBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "https://inkspire-blogs-app1.onrender.com/api/blogs/my/blogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("My blogs:", res.data);
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your blogs");
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBlogs();
  }, [navigate]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://inkspire-blogs-app1.onrender.com/api/blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      alert(" Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(" Failed to delete blog");
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
        <div className="myblogs-container">
          <div className="myblogs-loading">
            <div className="spinner"></div>
            <div>Loading your blogs...</div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  if (error) {
    return (
      <VideoBackground>
        <div className="myblogs-container">
          <div className="myblogs-empty" style={{ border: "2px solid #e74c3c" }}>
            <span className="myblogs-emoji"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="myblogs-btn-primary"
              onClick={() => window.location.reload()}
            >
              <><i class="fa fa-spinner" aria-hidden="true"></i>
</>&nbsp; Try Again
            </button>
          </div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground>
      <div className="myblogs-container">
        <div className="myblogs-header">
          <h1>
            <><i class="fa fa-book" aria-hidden="true"></i></>&nbsp; My Blogs
            <span className="myblogs-count">{blogs.length}</span>
          </h1>
          <div className="myblogs-header-actions">
            <Link to="/create">
              <button className="myblogs-btn-primary">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Create New
              </button>
            </Link>
            <Link to="/">
              <button className="myblogs-btn-secondary">
                <i class="fa fa-home" aria-hidden="true"></i> Home
              </button>
            </Link>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="myblogs-empty">
            <span className="myblogs-emoji"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>
            <h2>No Blogs Yet</h2>
            <p>You haven't created any blogs yet. Start writing your first blog!</p>
            <Link to="/create">
              <button className="myblogs-btn-primary">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Create Blog
              </button>
            </Link>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="myblogs-card">
              <Link to={`/blog/${blog._id}`}>
              {blog.image && (
                <img
                  src={
                    blog.image.startsWith("http")
                      ? blog.image
                      : `https://inkspire-blogs-app1.onrender.com${blog.image}`
                  }
                  alt={blog.title || "Blog"}
                  className="myblogs-card-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              </Link>

              {blog.category && (
                <div className="myblogs-category">
                   {blog.category}
                </div>
              )}

              <Link to={`/blog/${blog._id}`} className="myblogs-card-title">
                {blog.title || "Untitled Blog"}
              </Link>

              <div className="myblogs-card-meta">
                <span><i class="fa fa-calendar" aria-hidden="true"></i> {formatDate(blog.createdAt)}</span>
                <span> <strong>{blog.likes?.length || 0}❤️</strong></span>
                <span> <strong>{blog.savedCount || 0} &nbsp;<><i class="fa fa-bookmark" aria-hidden="true"></i></>
</strong></span>
              </div>

              <p className="myblogs-card-content">{truncateContent(blog.content)}</p>

              <div className="myblogs-card-actions">
                {/*  Edit Button - Link to /edit/:id */}
                <Link to={`/edit/${blog._id}`}>
                  <button className="myblogs-btn-edit">
                    <i class="fa fa-pencil" aria-hidden="true"></i> Edit
                  </button>
                </Link>
                
                {/*  Delete Button - Direct function call */}
                <button
                  className="myblogs-btn-delete"
                  onClick={() => handleDelete(blog._id)}
                >
                  <i class="fa fa-trash" aria-hidden="true"></i> Delete
                </button>
                
                {/*  Read More Button - Link to /blog/:id */}
                <Link to={`/blog/${blog._id}`} style={{ marginLeft: "auto" }}>
                  <button className="myblogs-btn-read">
                     Read More<i class="fa fa-long-arrow-right" aria-hidden="true"></i>

                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </VideoBackground>
  );
}

export default MyBlogs;