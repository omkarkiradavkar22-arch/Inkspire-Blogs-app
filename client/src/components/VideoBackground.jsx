import React from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";

//const AUTH_IMAGE_URL =  "https://d8j9ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";




function VideoBackground({ children, className = "" ,isAuth = false }) {
  // const videoUrl = isAuth ? AUTH_VIDEO_URL : DEFAULT_VIDEO_URL;
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/*  Video Background */}
      {/* { isAuth &&( */}
      
        <div className="video-background">
         <video autoPlay muted loop playsInline className="video-bg">
           <source src={VIDEO_URL} type="video/mp4" />
         </video>
         <div className="video-overlay"></div>
       </div>
         {/* )} */}


        {/* {isAuth && (
        <div 
          className="auth-image-background"
          style={{
            backgroundImage: `url('${AUTH_IMAGE_URL}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <div className="auth-image-overlay"></div>
        </div>
      )} */}

      {/*  Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default VideoBackground;