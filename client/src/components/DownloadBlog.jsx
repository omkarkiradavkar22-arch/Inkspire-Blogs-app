import { useState } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";

function DownloadBlog({ blogId, title }) {  
  const [isDownloading, setIsDownloading] = useState(false);
  const [blog, setBlog] = useState(null);

  // Function to fetch image as base64 (fallback if CORS still fails)
  // const fetchImageAsBase64 = async (imagePath) => {
  //   try {
  //     // Try different URL formats
  //     const urls = [imagePath];
      
  //     for (const url of urls) {
  //       try {
  //         const response = await fetch(url, {
  //           credentials: 'include',
  //           headers: {
  //             'Accept': 'image/*'
  //           }
  //         });
          
  //         if (response.ok) {
  //           const blob = await response.blob();
  //           return await new Promise((resolve) => {
  //             const reader = new FileReader();
  //             reader.onloadend = () => resolve(reader.result);
  //             reader.readAsDataURL(blob);
  //           });
  //         }
  //       } catch (e) {
  //         console.warn(`Failed to fetch from ${url}:`, e);
  //         continue;
  //       }
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error('Error loading image:', error);
  //     return null;
  //   }
  // };

  const handleDownload = async () => {
    if (!blogId) return;

    setIsDownloading(true);

    try {
      // Fetch blog data
      const res = await axios.get(`https://inkspire-blogs-app1.onrender.com/api/blogs/${blogId}`);
      const blogData = res.data;
      setBlog(blogData);

      //let imageBase64 = null;
      
      // If blog has image, try to load it
     // if (blogData.image) {
       // imageBase64 = await fetchImageAsBase64(blogData.image);
        
        // If base64 loading failed, try direct URL with CORS
       // if (!imageBase64) {
         // console.warn('Could not load image');
       // }
     // }

      // Create PDF content
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
              <h1 style="color: #1a1a2e; font-size: 28px; border-bottom: 2px solid #4a6cf7; padding-bottom: 12px;">
                ${blogData.title}
              </h1>
              <div style="color: #666; font-size: 14px; margin: 12px 0;">
                <span><i class="fa fa-user-circle" aria-hidden="true"></i> ${blogData.author?.username || "Unknown"}</span>
                <span style="margin-left: 20px;"><i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(blogData.createdAt).toLocaleDateString()}</span>
                <span style="margin-left: 20px;"> ${blogData.category || "Uncategorized"}</span>
              </div>
              ${
                blogData.image
                  ? `
                    <img
                      src="${blogData.image}"
                      crossorigin="anonymous"
                      style="
                        width:100%;
                        max-height:400px;
                        object-fit:cover;
                        border-radius:8px;
                        margin:16px 0;
                      "
                    />
                  `
                  : ""
              }
              <div style="font-size: 16px; line-height: 1.8; color: #333; white-space: pre-wrap;">
                ${blogData.content}
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                Downloaded from InkspireBlogApp • ${new Date().toLocaleDateString()}
              </div>
            </div>
          </body>
        </html>
      `;

      const opt = {
        margin: 10,
        filename: `${blogData.title || "blog"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
       html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 30000,
      },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      await html2pdf().set(opt).from(content).save();
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download PDF: ${error.message}`);
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
          <i className="fa fa-refresh" aria-hidden="true"></i>
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