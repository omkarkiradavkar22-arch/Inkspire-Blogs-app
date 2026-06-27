import { useState } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";


function DownloadBlog({ blogId, title }) {  
  const [isDownloading, setIsDownloading] = useState(false);
    const [blog, setBlog] = useState(null);

  const handleDownload = async () => {
    if (!blogId) return;

    setIsDownloading(true);

     try {
      // ✅ Fetch blog data
      const res = await axios.get(`http://localhost:5000/api/blogs/${blogId}`);
      const blogData = res.data;
      setBlog(blogData);

    //  Create PDF content

    const content = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; font-size: 28px; border-bottom: 2px solid #4a6cf7; padding-bottom: 12px;">
            ${blogData.title}
          </h1>
          <div style="color: #666; font-size: 14px; margin: 12px 0;">
            <span><i class="fa fa-user-circle" aria-hidden="true"></i> ${blogData.author?.username || "Unknown"}</span>
            <span style="margin-left: 20px;"><i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(blogData.createdAt).toLocaleDateString()}</span>
            <span style="margin-left: 20px;"> ${blogData.category || "Uncategorized"}</span>
          </div>
          ${blogData.image ? `<img src="http://localhost:5000${blogData.image}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin: 16px 0;" />` : ""}
          <div style="font-size: 16px; line-height: 1.8; color: #333; white-space: pre-wrap;">
            ${blogData.content}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            Downloaded from BlogApp • ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;



    const opt = {
        margin: 10,
        filename: `${blogData.title || "blog"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

    await html2pdf().set(opt).from(content).save();
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      className="neumorphic-btn small"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label="Download PDF"

      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {isDownloading ? (
        <>
          <span className="spinner" style={{ width: "18px", height: "18px" }}></span>
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </>
      ) : (
        <>
          <i className="fa fa-download" aria-hidden="true"></i>
        </>
      )}
    </button>
  );
}

export default DownloadBlog;