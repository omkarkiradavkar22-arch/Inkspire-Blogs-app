import User from "../models/User.js";
import Notification from "../models/Notification.js";

//  Follow a User
export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);

    //  Check if already following
    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      //  Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userId
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      await currentUser.save();
      await userToFollow.save();
      return res.json({ message: "Unfollowed", following: false });
    } else {
      //  Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);
      await currentUser.save();
      await userToFollow.save();

      //  Send Notification to user who got followed
      const notification = new Notification({
        recipient: userId,
        sender: currentUserId,
        type: "follow",
        // blogId: null,
        message: `${req.user.username} started following you`,
      });
      await notification.save();

      return res.json({ message: "Followed", following: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Get Followers
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    //  Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Check access: Only if following or self
    const isSelf = currentUserId === userId;
    const isFollowing = await User.exists({
      _id: currentUserId,
      following: userId
    });

    if (!isSelf && !isFollowing) {
      return res.status(403).json({ 
        message: "You must follow this user to see their followers" 
      });
    }

    //  Get followers with limited info
    const followers = await User.find(
      { following: userId },
      "username profilePic"
    );

    res.json(followers);
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: error.message });
  }
};
//  Get Following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Check access: Only if following or self
    const isSelf = currentUserId === userId;
    const isFollowing = await User.exists({
      _id: currentUserId,
      following: userId
    });

    if (!isSelf && !isFollowing) {
      return res.status(403).json({ 
        message: "You must follow this user to see who they follow" 
      });
    }

    //  Get following with limited info
    const following = await User.find(
      { followers: userId },
      "username profilePic"
    );

    res.json(following);
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: error.message });
  }
};


//  Check if following
export const checkFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userId);

    res.json({ following: isFollowing });
  } catch (error) {
    console.error("Check follow error:", error);
    res.status(500).json({ message: error.message });
  }
};