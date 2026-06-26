import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import followRoutes from "./routes/followRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);

app.get("/", (req, res) => {
  res.send("Blog API Running...");
});
app.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const imageUrl = blog.image 
      ? `http://localhost:5000${blog.image}` 
      : "https://your-default-image.com/default.jpg";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:title" content="${blog.title}" />
        <meta property="og:description" content="${blog.content.substring(0, 150)}..." />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="http://localhost:5173/blog/${blog._id}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${blog.title}" />
        <meta name="twitter:description" content="${blog.content.substring(0, 150)}..." />
        <meta name="twitter:image" content="${imageUrl}" />
        <meta http-equiv="refresh" content="0;url=http://localhost:5173/blog/${blog._id}" />
      </head>
      <body>
        <p>Redirecting to blog...</p>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});