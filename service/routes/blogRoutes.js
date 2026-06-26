import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogsByUser,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  getComments,
  getMyBlogs,
  saveBlog,
  updateComment,
  deleteComment,
  addReply,
  getCommentsWithReplies,
  getTrendingBlogs
} from "../controllers/blogController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/user/:userId", getBlogsByUser); 
router.get("/:id/comments", getComments);
router.get("/:id", getBlogById);
router.get("/my/blogs", authMiddleware, getMyBlogs);
router.post("/create",authMiddleware,upload.single("image"),createBlog);
router.put("/:id", authMiddleware, upload.single("image"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
// router.put("/:id", authMiddleware, updateBlog);
router.post("/:id/like", authMiddleware, likeBlog);
router.put("/:id/like", authMiddleware, likeBlog);
router.post("/:id/comment", authMiddleware, addComment);
router.post("/:id/save", authMiddleware, saveBlog);
router.post("/:id",authMiddleware,upload.single("image"),updateBlog);

router.put(
  "/comments/:commentId",
  authMiddleware,
  updateComment
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  deleteComment
);


router.post("/comments/:commentId/reply", authMiddleware, addReply);
router.get("/:id/comments-with-replies", getCommentsWithReplies);

export default router;