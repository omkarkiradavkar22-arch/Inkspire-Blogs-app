import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import fs from "fs";
import path from "path";import Notification from "../models/Notification.js";

export const createBlog = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, content, category } = req.body;

    const blog = await Blog.create({
      title,
      content,
      category,
      author: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    // Send Notification to ALL Followers
    const author = await User.findById(req.user.id).populate("followers", "_id");
    
    if (author.followers && author.followers.length > 0) {
      const notifications = author.followers.map((follower) => ({
        recipient: follower._id,
        sender: req.user.id,
        type: "new_blog",
        blogId: blog._id,
        message: `${req.user.username} published a new blog "${title}"`,
      }));
      
      await Notification.insertMany(notifications);
    }

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    //  Search filter
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { "author.username": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalBlogs = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate("author", "username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      blogs,
      totalBlogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username profilePic");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    const savedCount = await User.countDocuments({
  savedBlogs: req.params.id,
});
 const savedBy = await User.find({ savedBlogs: req.params.id }).select("_id");
    const savedByIds = savedBy.map(user => user._id);
    res.json({
  ...blog.toObject(),
  savedCount,
  savedBy: savedByIds,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    blog.title = req.body.title;
blog.content = req.body.content;
blog.category = req.body.category;

if (req.file) {
  if (blog.image) {
        const oldImagePath = path.join("uploads", path.basename(blog.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        }
      }
      blog.image = `/uploads/${req.file.filename}`;
      console.log("New image saved:", blog.image);
}
await blog.save();

res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await blog.deleteOne();

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//  Like Blog Controller
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user.id;
    const index = blog.likes.indexOf(userId);

    let liked = false;

    if (index === -1) {
      //  Like
      blog.likes.push(userId);
      liked = true;
    

    if (blog.author.toString() !== userId) {
        const notification = new Notification({
          recipient: blog.author,
          sender: userId,
          type: "like",
          blogId: blog._id,
          message: `${req.user.username} liked your blog "${blog.title}"`,
        });
        await notification.save();
      }
    } else {
      blog.likes.splice(index, 1);
    }


    await blog.save();

    //  Return updated likes array
    res.json({ 
      message: index === -1 ? "Blog liked" : "Blog unliked",
      likes: blog.likes 
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = await Comment.create({
      text,
      blog: req.params.id,
      user: req.user.id,
    });

    await comment.save();
    await comment.populate("user", "username profilePic");

    if (blog.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: blog.author,
        sender: req.user.id,
        type: "comment",
        blogId: blog._id,
        commentId: comment._id,
        message: `${req.user.username} commented: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}" on your blog "${blog.title}"`,
      });
      await notification.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.id,
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    const blogsWithCounts = await Promise.all(
  blogs.map(async (blog) => {
    const commentsCount = await Comment.countDocuments({
      blog: blog._id,
    });

    const savedCount = await User.countDocuments({
      savedBlogs: blog._id,
    });

    return {
      ...blog._doc,
      likesCount: blog.likes.length,
      commentsCount,
      savedCount,
    };
  })
);
    res.json(blogsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const saveBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const blogId = req.params.id;

    const alreadySaved = user.savedBlogs.includes(req.params.id);

    if (alreadySaved) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId
      );

      await user.save();

      return res.json({
        message: "Blog removed from saved",
      });
    }

    user.savedBlogs.push(blogId);

    await user.save();

    res.json({
      message: "Blog saved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can edit only your own comments",
      });
    }

    comment.text = req.body.text;

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const blog = await Blog.findById(
      comment.blog
    );

    const isCommentOwner =
      comment.user.toString() === req.user.id;

    const isBlogOwner =
      blog.author.toString() === req.user.id;

    if (!isCommentOwner && !isBlogOwner) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .populate("author", "username profilePic")
      .sort({ createdAt: -1 });

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentsCount = await Comment.countDocuments({
          blog: blog._id,
        });
        return {
          ...blog.toObject(),
          commentsCount: commentsCount || 0,
        };
      })
    );

    res.json(blogsWithCounts);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;

    const parentComment = await Comment.findById(commentId).populate("user", "username profilePic");
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }


    const reply = new Comment({
      text,
      user: req.user.id,
      blog: parentComment.blog,
      parentComment: commentId,
    });

    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    await reply.populate("user", "username profilePic");

    if (parentComment.user._id.toString() !== req.user.id) {
      const blog = await Blog.findById(parentComment.blog);
      const notification = new Notification({
        recipient: parentComment.user._id,
        sender: req.user.id,
        type: "reply",
        blogId: parentComment.blog,
        commentId: parentComment._id,
        message: `${req.user.username} replied to your comment on "${blog?.title || "blog"}"`,
      });
      await notification.save();
    }

    res.status(201).json(reply);
  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getNestedReplies = async (commentId) => {
  const replies = await Comment.find({ parentComment: commentId })
    .populate("user", "username profilePic")
    .sort({ createdAt: 1 });

  for (let reply of replies) {
    reply.replies = await getNestedReplies(reply._id);
  }

  return replies;
};

export const getCommentsWithReplies = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.id,
      parentComment: null,
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    
    for (let comment of comments) {
      comment.replies = await getNestedReplies(comment._id);
    }

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username profilePic")
      .sort({ likes: -1, savedCount: -1 })
      .limit(10);

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentsCount = await Comment.countDocuments({
          blog: blog._id,
        });

        const savedCount = await User.countDocuments({
          savedBlogs: blog._id,
        });

        return {
          ...blog.toObject(),
          commentsCount,
          likesCount: blog.likes?.length || 0,
          savedCount: savedCount || 0,  //  हे बरोबर
        };
      })
    );

    res.json(blogsWithCounts);
  } catch (error) {
    console.error("Trending error:", error);
    res.status(500).json({ message: error.message });
  }
};