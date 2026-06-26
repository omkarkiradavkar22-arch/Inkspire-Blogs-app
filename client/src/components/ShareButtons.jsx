import { useState } from "react";
import SharePopup from "./SharePopup";
import DownloadBlog from "../components/DownloadBlog";
import "../styles/neomorphism.css";

function ShareButtons({ blogId, title }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="share-buttons-wrapper">
      {/* ✅ Share Icon - Clickable */}
      <button
        className="neumorphic-btn small"
        onClick={handleOpenPopup}
        aria-label="Share"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <i className="fa fa-share-alt" aria-hidden="true"></i>
      </button>

      {/* ✅ Share Popup */}
      {showPopup && (
        <SharePopup
          blogId={blogId}
          title={title}
          onClose={handleClosePopup}
        />
      )}

      <DownloadBlog blogId={blogId} title={title} />
    </div>
  );
}

export default ShareButtons;