import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("savedBlogs");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username = username || user.username;
    if (req.file) {

  // Delete old profile picture from Cloudinary
  if (user.profilePic) {
    try {
      const publicId = user.profilePic
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
      console.log("Old profile picture deleted");
    } catch (err) {
      console.log("Delete failed:", err.message);
    }
  }

  // Save new Cloudinary image URL
  user.profilePic = req.file.path;
}

    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedBlogs',
        populate: { 
          path: 'author', 
          select: 'username profilePic' 
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.json(user.savedBlogs || []);
  } catch (error) {
    console.error("Error fetching saved blogs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .select("-resetToken")
      .select("-resetTokenExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const followersCount = await User.countDocuments({
      following: req.params.userId
    });

    const followingCount = await User.countDocuments({
      followers: req.params.userId
    });

    res.json({
      ...user.toObject(),
      followersCount: followersCount || 0,
      followingCount: followingCount || 0,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};