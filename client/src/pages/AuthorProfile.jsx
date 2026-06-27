import { useEffect, useState } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import axios from "axios";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";
import FollowButton from "../components/FollowButton";
import FollowersList from "../components/FollowersList";


function AuthorProfile() {
  const { userId } = useParams();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?._id || currentUser?.id;
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        console.log("Fetching author ID:", userId);
        
        if (!userId) {
          setError("User ID is missing");
          setIsLoading(false);
          return;
        }

        //  Fetch Author Details
        const userRes = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        console.log("Author data:", userRes.data);
        setAuthor(userRes.data);
        
        //  Fetch Author's Blogs
        const blogsRes = await axios.get(
          `http://localhost:5000/api/blogs/user/${userId}`
        );
        console.log("Blogs data:", blogsRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 404) {
          setError("User not found");
        } else {
          setError(error.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [userId]);

  // Follow change handler
const handleFollowChange = (isFollowing) => {
  setAuthor((prev) => ({
    ...prev,
    followersCount: isFollowing 
      ? (prev.followersCount || 0) + 1 
      : (prev.followersCount || 0) - 1,
  }));
};
  
  //  Loading State
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
  
  //  Error State
  if (error) {
    return (
      <VideoBackground>
        <div className="edit-profile-container">
          <div className="empty-saved" style={{ border: "2px solid #e74c3c" }}>
            <span className="emoji">⚠️</span>
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/">
              <button className="auth-btn" style={{ maxWidth: "200px", margin: "0 auto" }}>
                🏠 Back to Home
              </button>
            </Link>
          </div>
        </div>
      </VideoBackground>
    );
  }
  
  //  User Not Found
  if (!author) {
    return (
      <VideoBackground>
        <div className="edit-profile-container">
          <div className="empty-saved">
            <span className="emoji">⚠️</span>
            <h2>User not found</h2>
            <Link to="/">
              <button className="auth-btn" style={{ maxWidth: "200px", margin: "0 auto" }}>
                🏠 Back to Home
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
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}>
          {/*  Author Profile Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div className="profile-pic-preview">
            <img
              src={
                author.profilePic
                  ? author.profilePic.startsWith("http")
                    ? author.profilePic
                    : `http://localhost:5000${author.profilePic}`
                    : "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=120"
                  }
              alt={author.username}
              className="profile-pic-avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            />
            </div>
            <h1 className="edit-profile-title" style={{ color: "white", fontSize: "28px" }}>
              <><i class="fa fa-user-circle-o" aria-hidden="true"></i>
</>&nbsp; {author.username}
            </h1>

            <p style={{ color: "rgba(255,255,255,0.6)" }}>{author.email}</p>

            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "30px", 
              marginTop: "12px" 
            }}>
              <div className="follow"
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => setShowFollowers(true)}
              >
                <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                  {author.followersCount || 0}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>
                  Followers
                </span>
              </div>
              <div className="following"
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => setShowFollowing(true)}
              >
                <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                  {author.followingCount || 0}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>
                  Following
                </span>
              </div>
            </div>
            <br/>

             {currentUserId && currentUserId !== author._id && (
              <div style={{ marginTop: "16px" }}>

    <FollowButton userId={author._id} onFollowChange={handleFollowChange} />
    </div>
  )}
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              <><i class="fa fa-calendar" aria-hidden="true"></i>
</>&nbsp; Joined: {new Date(author.createdAt).toLocaleDateString()}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              <><i class="fa fa-book" aria-hidden="true"></i>
</>&nbsp; {blogs.length} Blogs
            </p>
          </div>

          {/*  Author's Blogs */}
                {/* <h2 className="text-white text-2xl font-semibold mb-5 ml-12 flex items-center gap-2"> */}
                <h2 className="edit-profile-title">
                  <i className="fa fa-book" aria-hidden="true"></i>
                All Blogs by {author.username}
                </h2>
              {/*  Back to Home Button */}
              <div style={{ marginTop: "20px" }}>
                <Link to="/">
                  <button className="cancel-btn" style={{ width: "100%" }}>
                    <><i class="fa fa-home" aria-hidden="true"></i>
                      </>&nbsp; Back to Home
                  </button>
                </Link>
              </div>
                </div>
        </div>


          {blogs.length === 0 ? (
            <div className="no-results">
              <p style={{ color: "rgba(255,255,255,0.6)" }}>No blogs found.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <div key={blog._id} className="glass-effect">
                  {blog.image && (
                  <Link to={`/blog/${blog._id}`}>
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="blog-image"
                      style={{ height: "150px" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    </Link>
                  )}
                  <div className="blog-content-wrapper">
                    {blog.category && (
                      <span className="blog-category-tag"> {blog.category}</span>
                    )}
                    <Link to={`/blog/${blog._id}`} className="blog-title">
                      {blog.title}
                    </Link>
                    <p className="blog-content">
                      {blog.content?.substring(0, 80)}...
                    </p>
                    <div className="blog-meta">
                      <span> {blog.likes?.length || 0}❤️</span>
                      <span> {blog.commentsCount || 0}&nbsp;<><i class="fa fa-commenting" aria-hidden="true"></i></></span>
                    </div>
                    <div className="mt-3">
                    <Link to={`/blog/${blog._id}`}>
                      <button className="neumorphic-btn small">
                        More<i class="fa fa-long-arrow-right" aria-hidden="true"></i>

                      </button>
                    </Link>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
           {showFollowers && (
        <FollowersList 
          userId={author._id} 
          type="followers" 
          onClose={() => setShowFollowers(false)} 
        />
      )}

      {/*  Following Modal */}
      {showFollowing && (
        <FollowersList 
          userId={author._id} 
          type="following" 
          onClose={() => setShowFollowing(false)} 
        />
      )}

    </VideoBackground>
  );
}

export default AuthorProfile;