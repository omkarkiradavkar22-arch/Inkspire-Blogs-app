import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function TrendingBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("https://inkspire-blogs-app1.onrender.com/api/blogs/trending");
        setBlogs(res.data);
      } catch (error) {
        console.error("Trending error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (isLoading) {
    return (
      <div className="trending-container" style={{ textAlign: "center", padding: "20px" }}>
        <span className="spinner" style={{ width: "24px", height: "24px", display: "inline-block" }}></span>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="trending-container">
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "10px" }}>
          No trending blogs yet
        </p>
      </div>
    );
  }

  return (
    <div className="trending-container">
      <h3 className="trending-title">
        🔥 Trending Blogs
      </h3>
      <div className="trending-list">
        {blogs.map((blog, index) => (
          <Link
            key={blog._id}
            to={`/blog/${blog._id}`}
            className="trending-item"
          >
            <span className="trending-rank">#{index + 1}</span>
            <div className="trending-content">
              <span className="trending-blog-title">{blog.title}</span>
              <span className="trending-meta">
                   {blog.likesCount || blog.likes?.length || 0} ❤️ • 
                   <></>&nbsp;{blog.savedCount || 0}&nbsp;<><i class="fa fa-bookmark" aria-hidden="true"></i></> • 
                 {blog.commentsCount || 0}&nbsp;<><i class="fa fa-comments" aria-hidden="true"></i></>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TrendingBlogs;