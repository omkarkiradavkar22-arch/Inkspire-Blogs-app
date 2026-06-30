import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VideoBackground from "../components/VideoBackground"; // ✅ Import
import "../styles/neomorphism.css";

function CreatePost() {
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  //  Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a title!" });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: "error", text: "Please enter content!" });
      return;
    }
    if (!category.trim()) {
      setMessage({ type: "error", text: "Please enter a category!" });
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
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("category", category.trim());
      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        "https://inkspire-blogs-app1.onrender.com/api/blogs/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({ type: "success", text: "✅ Blog created successfully!" });
      
      setTimeout(() => {
        setTitle("");
        setContent("");
        setCategory("");
        setImage(null);
        setImagePreview(null);
        setMessage({ type: "", text: "" });
        navigate("/");
      }, 1500);

    } catch (error) {
      console.log(error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "❌ Error creating blog. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VideoBackground>
      <div className="create-post-container">
        <div className="create-post-card">
          <h1 className="create-post-title">
             Create New Blog
          </h1>

          {message.text && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"> Title</label>
              <input
                type="text"
                className="neo-input"
                placeholder="Enter blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label"> Content</label>
              <textarea
                className="neo-textarea"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label"> Category</label>
              <input
                type="text"
                className="neo-input"
                placeholder="Enter category (e.g., Technology, Travel, Food...)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><i class="fa fa-picture-o" aria-hidden="true"></i> Featured Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="neo-file-input"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <i class="fa fa-upload" aria-hidden="true"></i>
 Publish Blog
                </>
              )}
            </button>

            <button
              type="button"
              className="submit-btn"
              onClick={() => navigate("/")}
              style={{ 
                marginTop: "12px",
                background: "transparent",
                boxShadow: "inset 3px 3px 8px var(--dark-shadow), inset -3px -3px 8px var(--light-shadow)",
                color: "var(--text-secondary)"
              }}
              disabled={isSubmitting}
            >
              <><i class="fa fa-times" aria-hidden="true"></i>
</>&nbsp; Cancel
            </button>
          </form>
        </div>
      </div>
    </VideoBackground>
  );
}

export default CreatePost;