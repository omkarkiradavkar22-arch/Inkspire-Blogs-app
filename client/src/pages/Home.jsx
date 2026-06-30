import { useEffect, useState } from "react";
import API from "../services/api";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";
import ShareButtons from "../components/ShareButtons";
import TrendingBlogs from "../components/TrendingBlogs";
import Pagination from "../components/Pagination";

const token = localStorage.getItem("token");
const isLoggedIn = !!token;


function Home() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {setIsLoading(true);

        const res = await API.get(`/?page=${currentPage}&limit=9`);
      console.log("BLOGS:", res.data);
      setPosts(res.data.blogs || []);
      setTotalPages(res.data.totalPages || 1);
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const savedRes = await axios.get(
              "https://inkspire-blogs-app1.onrender.com/api/users/saved-blogs",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const savedIds = new Set(savedRes.data.map(blog => blog._id));
            setSavedPosts(savedIds);
          } catch (err) {
            console.log("Saved blogs error:", err);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `https://inkspire-blogs-app1.onrender.com/api/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? {
                ...post,
                likes: res.data.likes,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleSave = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.post(`/${blogId}/save`);
      
      setSavedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(blogId)) {
          newSet.delete(blogId);
        } else {
          newSet.add(blogId);
        }
        return newSet;
      });

      // alert(res.data.message);
    } catch (error) {
      console.error("Save error:", error);
      navigate("/login");
    }
  };

  const filteredBlogs = posts.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.category?.toLowerCase().includes(search.toLowerCase()) ||
       blog.author?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  if (isLoading) {
    return (
      <VideoBackground>
        <div className="home-container">
          <div className="saved-loading">
            <div className="spinner"></div>
            <div>Loading blogs...</div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground>
      <div className="home-container">
         {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
          <TrendingBlogs />
          <br />


        <h1 className="page-title">All Posts</h1>

        {filteredBlogs.length === 0 ? (
          <div className="no-results">
            <p> No blogs found.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((post) => {
              const isSaved = savedPosts.has(post._id); 
              return (
                <div key={post._id} className="glass-effect">
                  <Link to={`/blog/${post._id}`} className="blog-title">
                  {post.image && (
                    <img
                      src={`https://inkspire-blogs-app1.onrender.com${post.image}`}
                      alt={post.title}
                      className="blog-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  </Link>
                  <div className="blog-content-wrapper">
                    {post.category && (
                      <span className="blog-category-tag"> {post.category}</span>
                    )}
                    <Link to={`/blog/${post._id}`} className="blog-title">
                      {post.title}
                    </Link>
                    <p className="blog-content">{truncateContent(post.content)}</p>
                    <div className="blog-meta">
                      <span><><i class="fa fa-user" aria-hidden="true"></i></>&nbsp;
                       {post.author?.username || "Unknown"}</span>
                      <span> {post.likes?.length || 0}❤️</span>
                    </div>
                    <div className="blog-actions">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`neumorphic-btn small ${
                          post.likes?.includes(localStorage.getItem("userId"))
                            ? "liked"
                            : ""
                        }`}
                      >
                         {post.likes?.length || 0}❤️
                      </button>

                      {/* Font Awesome Save Button - Working */}
                      <button
                        onClick={() => handleSave(post._id)}
                        className="neumorphic-btn small"
                        >
                        {isSaved ? (
                          <i className="fa fa-bookmark" aria-hidden="true"></i>
                        ) : (
                          <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                        )}
                     
                      </button>
                        
                            
                            <ShareButtons  blogId={post._id} title={post.title} />
                            

                      <Link to={`/blog/${post._id}`} className="read-more-link">
                        <button className="neumorphic-btn small">more<i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </VideoBackground>
  );
}

export default Home;