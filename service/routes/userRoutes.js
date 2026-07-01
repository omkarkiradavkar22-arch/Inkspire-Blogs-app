import express from "express";
import {
          getUserById,
           getProfile,
        updateProfile,
        getSavedBlogs
        } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);
router.get("/saved-blogs",authMiddleware,getSavedBlogs);
router.get("/:userId", getUserById);

export default router;