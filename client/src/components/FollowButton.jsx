import { useState, useEffect } from "react";
import axios from "axios";

function FollowButton({ userId, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `https://inkspire-blogs-app1.onrender.com/api/follow/${userId}/check`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(res.data.following);
      } catch (error) {
        console.log("Check follow error:", error);
      }
    };

    if (userId) {
      checkFollowStatus();
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to follow");
        return;
      }

      setIsLoading(true);
      const res = await axios.post(
        `https://inkspire-blogs-app1.onrender.com/api/follow/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(res.data.following);
      
      if (onFollowChange) {
        onFollowChange(res.data.following);
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isFollowing
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
