import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import followRoutes from "./routes/followRoutes.js";
import Blog from "./models/Blog.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors({
  origin: ["http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:5173",
    "https://inkspire-blogs-app.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'], // Add if needed
  optionsSuccessStatus: 200 // For legacy browsers
}));

app.use("/uploads", (req, res, next) => {
  // Add headers for static files
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    // Cache images for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);

app.get("/api/images/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "uploads", filename);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set CORS headers
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Send the file
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Error serving image' });
  }
});

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
  ? blog.image.startsWith("http")
    ? blog.image
    : `https://inkspire-blogs-app1.onrender.com${blog.image}`
  : "https://inkspire-blogs-app1.onrender.com/uploads/default.png";

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <title>${blog.title}</title>
          <meta name="description" content="${blog.content.substring(0, 150)}..." />

          <meta property="og:title" content="${blog.title}" />
          <meta property="og:description" content="${blog.content.substring(0, 150)}..." />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:image:secure_url" content="${imageUrl}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:site_name" content="Inkspire" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:url" content="https://inkspire-blogs-app.vercel.app/blog/${blog._id}" />
          <meta property="og:type" content="article" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${blog.title}" />
          <meta name="twitter:description" content="${blog.content.substring(0, 150)}..." />
          <meta name="twitter:image" content="${imageUrl}" />
          <meta name="twitter:image:alt" content="${blog.title}" />

          <meta http-equiv="refresh" content="2;url=https://inkspire-blogs-app.vercel.app/blog/${blog._id}" />
        </head>

        <body>
          <h2>${blog.title}</h2>

          <img
            src="${imageUrl}"
            alt="${blog.title}"
            style="max-width:100%;height:auto;border-radius:10px;"
          />

          <p>${blog.content.substring(0, 150)}...</p>

          <p>Redirecting to blog...</p>

          <script>
            setTimeout(() => {
              window.location.href =
                "https://inkspire-blogs-app.vercel.app/blog/${blog._id}";
            }, 2000);
          </script>
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