import React from "react";

const BG_IMAGE = "/background_image.png";
function VideoBackground({ children, className = "" ,isAuth = false }) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      
        <div className="video-background" style={{backgroundImage:`url(${BG_IMAGE})`}}>
        
         <div className="video-overlay"></div>
       </div>

        
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default VideoBackground;