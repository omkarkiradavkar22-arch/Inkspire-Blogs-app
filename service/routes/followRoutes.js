import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  followUser,
  getFollowers,
  getFollowing,
  checkFollow,
} from "../controllers/followController.js";

const router = express.Router();

router.post("/:userId/follow", authMiddleware, followUser);
router.get("/:userId/followers", authMiddleware, getFollowers);
router.get("/:userId/following", authMiddleware, getFollowing);
router.get("/:userId/check", authMiddleware, checkFollow);

export default router;