import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import "../styles/neomorphism.css";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  //  Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  //  Fetch Blog Data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogs/${id}`
        );

        console.log(res.data);

        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category);
        if (res.data.image) {
          setCurrentImage(res.data.image);
        }
      } catch (error) {
        console.log(error);
        setMessage({ 
          type: "error", 
          text: " Failed to load blog. Please try again." 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  //  Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  Remove Image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setImageName("");
    document.getElementById("edit-image-input").value = "";
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    //  Validation
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

      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //  Success
      setMessage({ type: "success", text: " Blog updated successfully!" });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/myblogs");
      }, 1500);

    } catch (error) {
      console.log(error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "❌ Error updating blog. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <VideoBackground>
        <div className="edit-blog-container">
          <div className="edit-loading">
            <div className="spinner"></div>
            <div>Loading Blog...</div>
          </div>
        </div>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground>
      <div className="edit-blog-container">
        <div className="edit-blog-card">
          {/*  Title */}
          <h1 className="edit-blog-title">
            <i class="fa fa-pencil-square" aria-hidden="true"></i> Edit Blog
          </h1>

          {/*  Message Display */}
          {message.text && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/*  Form */}
          <form onSubmit={handleUpdate}>
            {/*  Title Field */}
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

            {/*  Category Field */}
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

            {/*  Content Field */}
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="neo-textarea"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/*  Current Image */}
            {currentImage && !imagePreview && (
              <div className="form-group">
                <label className="current-image-label"><i class="fa fa-picture-o" aria-hidden="true"></i> Current Image</label>
                <div className="current-image">
                  <img
                    src={
                      currentImage.startsWith("http")
                        ? currentImage
                        : `http://localhost:5000${currentImage}`
                    }
                    alt="Current"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {currentImage ? (
                  <>
                    <i className="fa fa-exchange" aria-hidden="true"></i>&nbsp; Change Image (Optional)
                  </>
                ) : (
                  <>
                    <i className="fa fa-upload" aria-hidden="true"></i>&nbsp; Upload Image (Optional)
                  </>
                )}
              </label>

              <div className="file-upload-wrapper">
                <input
                  id="edit-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="file-upload-input"
                />
                
                <label htmlFor="edit-image-input" className="file-upload-label">
                  <div className="file-upload-icon">
                    {imagePreview || imageName ? (
                      <i className="fa fa-image" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-cloud-upload" aria-hidden="true"></i>
                    )}
                  </div>
                  <div className="file-upload-text">
                    <span className="file-upload-main">
                      {imageName || "Choose an image"}
                    </span>
                    <span className="file-upload-sub">
                      {imageName ? `${(image.size / 1024).toFixed(1)} KB` : "PNG, JPG, WEBP up to 5MB"}
                    </span>
                  </div>
                  <div className="file-upload-status">
                    {imageName ? (
                      <>
                        <i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp; Selected
                      </>
                    ) : (
                      <>
                        <i className="fa fa-folder-open" aria-hidden="true"></i>&nbsp; Browse
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/*  Remove image button */}
              {imageName && (
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
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
                  <><i class="fa fa-times" aria-hidden="true"></i>
</>&nbsp; Remove File
                </button>
              )}
              
              {/*  New Image Preview */}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <div style={{ 
                    fontSize: "13px", 
                    color: "rgba(255,255,255,0.5)", 
                    padding: "8px 12px",
                    textAlign: "center"
                  }}>
                    New image (will replace current)
                  </div>
                </div>
              )}
            </div>

            {/*  Form Actions */}
            <div className="form-actions">
              {/*  Update Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i class="fa fa-wrench" aria-hidden="true"></i> Update Blog
                  </>
                )}
              </button>

              {/*  Cancel Button */}
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/myblogs")}
                disabled={isSubmitting}
              >
                <><i class="fa fa-times" aria-hidden="true"></i>
</>&nbsp; Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </VideoBackground>
  );
}

export default EditBlog;