import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";
import ShareButtons from "../components/ShareButtons";
import DownloadBlog from "../components/DownloadBlog";
import { Helmet } from "react-helmet";

function BlogDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [likes, setLikes] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?._id || currentUser?.id;
  const isLoggedIn = !!localStorage.getItem("token");

  //  Fetch Blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
        setLikes(res.data.likes?.length || 0);
        setSavedCount(res.data.savedCount || 0);
        if (currentUser._id) {
          setIsSaved(res.data.savedBy?.includes(currentUser._id) || false);
        }
        console.log(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
    fetchComments();
  }, [id]);

  // ✅ Scroll to comment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const commentId = params.get("comment");
    const shouldReply = params.get("reply") === "true";
    if (commentId) {
      setTimeout(() => {
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
          commentElement.style.border = "2px solid #4a6cf7";
          commentElement.style.borderRadius = "12px";
          setTimeout(() => {
            commentElement.style.border = "none";
          }, 3000);
          if (shouldReply) {
            setReplyingTo(commentId);
            setTimeout(() => {
              const replyInput = document.getElementById(`reply-input-${commentId}`);
              if (replyInput) {
                replyInput.focus();
              }
            }, 600);
          }
        }
      }, 500);
    }
  }, []);

  // ✅ Fetch Comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/${id}/comments-with-replies`
      );
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.put(
        `http://localhost:5000/api/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blogRes = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(blogRes.data);
      setLikes(blogRes.data.likes?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) {
      alert("Please write a comment!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.post(
        `http://localhost:5000/api/blogs/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.post(
        `http://localhost:5000/api/blogs/${id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(!isSaved);
      setSavedCount((prev) => (isSaved ? prev - 1 : prev + 1));
      const blogRes = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(blogRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/blogs/comments/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingComment(null);
      setEditText("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/blogs/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) {
      alert("Please write a reply!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.post(
        `http://localhost:5000/api/blogs/comments/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ ReplyItem Component - सगळ्यांना reply द्या
  const ReplyItem = ({ reply, isBlogOwner }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [localReplyText, setLocalReplyText] = useState("");
    const isReplyOwner = currentUserId?.toString() === reply.user?._id?.toString();

    const handleLocalReply = async () => {
      if (!localReplyText.trim()) {
        alert("Please write a reply!");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        await axios.post(
          `http://localhost:5000/api/blogs/comments/${reply._id}/reply`,
          { text: localReplyText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocalReplyText("");
        setShowReplyInput(false);
        fetchComments();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div style={{ marginLeft: "48px", marginTop: "10px" }}>
        <div className="comment-card" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="comment-header">
              <Link
              to={`/author/${reply.user?._id}`} 
              style={{ textDecoration: "none" }}
              >
            <div className="comment-user">
              <img
                src={
                  reply.user?.profilePic
                  ? `http://localhost:5000${reply.user.profilePic}`
                  : "https://ui-avatars.com/api/?name=User&background=6c6f8a&color=fff&size=36"
                }
                alt={reply.user?.username || "User"}
                className="comment-avatar"
                />
              <span className="comment-username">{reply.user?.username || "Unknown"}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>⤷ replied</span>
            </div>
                </Link>
            <span className="comment-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="comment-text">{reply.text}</p>

          <div className="comment-actions">
            {/* ✅ Reply Button - फक्त Logged In */}
            {isLoggedIn && (
              <button
                className="comment-action-btn"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <i className="fa fa-reply" aria-hidden="true"></i> Reply
              </button>
            )}

            {isReplyOwner && (
              <button
                className="comment-action-btn"
                onClick={() => {
                  setEditingComment(reply._id);
                  setEditText(reply.text);
                }}
              >
                <i className="fa fa-pencil" aria-hidden="true"></i> Edit
              </button>
            )}

            {(isReplyOwner || isBlogOwner) && (
              <button
                className="comment-action-btn delete"
                onClick={() => handleDeleteComment(reply._id)}
              >
                <i className="fa fa-trash" aria-hidden="true"></i> Delete
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="comment-edit-wrapper" style={{ marginTop: "10px" }}>
              <input
                type="text"
                className="comment-edit-input"
                placeholder="Write a reply..."
                value={localReplyText}
                onChange={(e) => setLocalReplyText(e.target.value)}
              />
              <button className="comment-edit-save" onClick={handleLocalReply}>
                <i className="fa fa-reply" aria-hidden="true"></i> Reply
              </button>
              <button
                className="comment-edit-save"
                onClick={() => {
                  setShowReplyInput(false);
                  setLocalReplyText("");
                }}
                style={{ color: "#ff6b6b" }}
              >
                <i className="fa fa-times" aria-hidden="true"></i> Cancel
              </button>
            </div>
          )}

          {editingComment === reply._id && (
            <div className="comment-edit-wrapper">
              <input
                type="text"
                className="comment-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button
                className="comment-edit-save"
                onClick={() => handleEditComment(reply._id)}
              >
                <i className="fa fa-check-square" aria-hidden="true"></i> Save
              </button>
              <button
                className="comment-edit-save"
                onClick={() => {
                  setEditingComment(null);
                  setEditText("");
                }}
                style={{ color: "#ff6b6b" }}
              >
                <i className="fa fa-times" aria-hidden="true"></i> Cancel
              </button>
            </div>
          )}
        </div>

        {reply.replies && reply.replies.length > 0 && (
          <div>
            {reply.replies.map((nestedReply) => (
              <ReplyItem key={nestedReply._id} reply={nestedReply} isBlogOwner={isBlogOwner} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <VideoBackground>
        <div className="blog-details-container">
          <div className="blog-loading">Loading Blog...</div>
        </div>
      </VideoBackground>
    );
  }

  if (!blog) {
    return (
      <VideoBackground>
        <div className="blog-details-container">
          <div className="blog-loading">Blog not found</div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <>
      <Helmet>
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.content?.substring(0, 150)} />
        <meta property="og:image" content={blog.image ? `http://localhost:5000${blog.image}` : "https://your-domain.com/default.jpg"} />
        <meta property="og:url" content={`http://localhost:5173/blog/${blog._id}`} />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.content?.substring(0, 150)} />
        <meta name="twitter:image" content={blog.image ? `http://localhost:5000${blog.image}` : "https://your-domain.com/default.jpg"} />
      </Helmet>

      <VideoBackground>
        <div className="blog-details-container">
          <div className="blog-details-card">
            {blog.image && (
              <img
                src={`http://localhost:5000${blog.image}`}
                alt={blog.title}
                className="blog-details-image"
              />
            )}

            {blog.category && <div className="blog-category"> {blog.category}</div>}

            <h1 className="blog-details-title">{blog.title}</h1>

            <Link to={`/author/${blog.author?._id}`} style={{ textDecoration: "none" }}>
              <div className="blog-author">
                <img
                  src={
                    blog.author?.profilePic
                      ? `http://localhost:5000${blog.author.profilePic}`
                      : "https://ui-avatars.com/api/?name=User&background=4a6cf7&color=fff&size=50"
                  }
                  alt={blog.author?.username || "User"}
                  className="blog-author-avatar"
                />
                <div className="blog-author-name">
                  {blog.author?.username || "Unknown Author"}
                  <span> • Author</span>
                </div>
              </div>
            </Link>

            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp;{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="blog-meta">
              <div className="blog-meta-item">
                <span>{likes}</span> ❤️
              </div>
              <div className="blog-meta-item">
                <span>{savedCount}</span>
                <i className="fa fa-bookmark" aria-hidden="true"></i>
              </div>
              <div className="blog-meta-item">
                <span>{comments.length}</span>
                <i className="fa fa-commenting" aria-hidden="true"></i>
              </div>
            </div>

            <div className="blog-content-text">{blog.content}</div>

            <div className="blog-actions">
              <button
                className="neumorphic-btn"
                onClick={handleLike}
                style={{
                  background: likes > 0 ? "rgba(231,76,60,0.0)" : "",
                  borderColor: likes > 0 ? "rgba(231,76,60,0.3)" : "",
                }}
              >
                {likes}❤️
              </button>

              <button
                className={`neumorphic-btn ${isSaved ? "saved" : ""}`}
                onClick={handleSave}
              >
                {isSaved ? (
                  <i className="fa fa-bookmark" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                )}
              </button>

              <button
                className="neumorphic-btn"
                onClick={() => navigate("/")}
                style={{ marginLeft: "auto" }}
              >
                <i className="fa fa-home" aria-hidden="true"></i>&nbsp; Home
              </button>
            </div>

            <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginRight: "12px" }}>
                <i className="fa fa-share-alt" aria-hidden="true"></i> Share:
              </span>
              <ShareButtons blogId={blog._id} title={blog.title} />
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <div className="comments-title">
              <i className="fa fa-commenting" aria-hidden="true"></i> Comments{" "}
              <span>{comments.length}</span>
            </div>

            <div className="comment-input-wrapper">
              <input
                type="text"
                className="comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
              />
              <button className="comment-post-btn" onClick={handleComment}>
                post <i className="fa fa-share" aria-hidden="true"></i>
              </button>
            </div>

            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  🤔 No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((c) => {
                  const isCommentOwner =
                    currentUserId?.toString() === c.user?._id?.toString();
                  const isBlogOwner =
                    currentUserId?.toString() === blog?.author?._id?.toString();

                  return (
                    <div key={c._id}>
                      <div className="comment-card" id={`comment-${c._id}`}>
                        <div className="comment-header">
                          <Link to={`/author/${c.user?._id}`}
                        style={{textDecoration:"none"}}>
                          <div className="comment-user">
                            <img
                              src={
                                c.user?.profilePic
                                  ? `http://localhost:5000${c.user.profilePic}`
                                  : "https://ui-avatars.com/api/?name=User&background=6c6f8a&color=fff&size=36"
                              }
                              alt={c.user?.username || "User"}
                              className="comment-avatar"
                            />
                            <span className="comment-username">
                              {c.user?.username || "Unknown"}
                            </span>
                          </div>
                          </Link>
                          <span className="comment-date">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="comment-text">{c.text}</p>

                        <div className="comment-actions">
                          {/* ✅ Reply Button - फक्त Logged In */}
                          {isLoggedIn && (
                            <button
                              className="comment-action-btn"
                              onClick={() => setReplyingTo(c._id)}
                            >
                              <i className="fa fa-reply" aria-hidden="true"></i> Reply
                            </button>
                          )}

                          {isCommentOwner && (
                            <button
                              className="comment-action-btn"
                              onClick={() => {
                                setEditingComment(c._id);
                                setEditText(c.text);
                              }}
                            >
                              <i className="fa fa-pencil" aria-hidden="true"></i> Edit
                            </button>
                          )}

                          {(isCommentOwner || isBlogOwner) && (
                            <button
                              className="comment-action-btn delete"
                              onClick={() => handleDeleteComment(c._id)}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i> Delete
                            </button>
                          )}
                        </div>

                        {replyingTo === c._id && (
                          <div className="comment-edit-wrapper" style={{ marginTop: "10px" }}>
                            <input
                              type="text"
                              className="comment-edit-input"
                              id={`reply-input-${c._id}`}
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button
                              className="comment-edit-save"
                              onClick={() => handleReply(c._id)}
                            >
                              <i className="fa fa-reply" aria-hidden="true"></i> Reply
                            </button>
                            <button
                              className="comment-edit-save"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              style={{ color: "#ff6b6b" }}
                            >
                              <i className="fa fa-times" aria-hidden="true"></i> Cancel
                            </button>
                          </div>
                        )}

                        {editingComment === c._id && (
                          <div className="comment-edit-wrapper">
                            <input
                              type="text"
                              className="comment-edit-input"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <button
                              className="comment-edit-save"
                              onClick={() => handleEditComment(c._id)}
                            >
                              <i className="fa fa-check-square" aria-hidden="true"></i> Save
                            </button>
                            <button
                              className="comment-edit-save"
                              onClick={() => {
                                setEditingComment(null);
                                setEditText("");
                              }}
                              style={{ color: "#ff6b6b" }}
                            >
                              <i className="fa fa-times" aria-hidden="true"></i> Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {c.replies && c.replies.length > 0 && (
                        <div>
                          {c.replies.map((reply) => (
                            <ReplyItem key={reply._id} reply={reply} isBlogOwner={isBlogOwner} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </VideoBackground>
    </>
  );
}

export default BlogDetails;
