import { useState } from "react";
import "../styles/neomorphism.css";

function SharePopup({ blogId, title, onClose }) {
  const [copied, setCopied] = useState(false);

  const blogUrl = `${window.location.origin}/blog/${blogId}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(title || "Check out this blog!");

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "fa-whatsapp",
      color: "#25d366",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Instagram",
      icon: "fa-instagram",
      color: "#e4405f",
      url: `https://www.instagram.com/?url=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: "fa-twitter",
      color: "#1da1f2",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: "fa-facebook",
      color: "#1877f2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: "fa-linkedin",
      color: "#0a66c2",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Copy Link",
      icon: "fa-link",
      color: "#4a6cf7",
      url: "#",
      action: "copy",
    },
  ];

  const handleShare = (option) => {
    if (option.action === "copy") {
      navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    window.open(option.url, "_blank", "width=600,height=400");
  };

  return (
    <div className="share-popup-overlay" onClick={onClose}>
      <div className="share-popup" onClick={(e) => e.stopPropagation()}>
        <div className="share-popup-header">
          <h3>
            <i className="fa fa-share-alt" aria-hidden="true"></i> Share
          </h3>
          <button className="share-popup-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="share-popup-body">
          <p className="share-popup-title">{title || "Check out this blog!"}</p>
          
          <div className="share-options-grid">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                className="share-option-btn"
                onClick={() => handleShare(option)}
              >
                <div
                  className="share-option-icon"
                  style={{ background: option.color }}
                >
                  <i className={`fa ${option.icon}`} aria-hidden="true"></i>
                </div>
                <span className="share-option-name">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {copied && (
          <div className="share-copied-toast">
            ✅ Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}

export default SharePopup;