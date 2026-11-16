import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Port
const port = process.env.PORT || 3000;

// MongoDB Atlas
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Connect to MongoDB
mongoose
  .connect(mongoUri, { dbName })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

// Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Model
const Post = mongoose.model("Post", postSchema);

// CREATE
app.post("/api/v1/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create post",
      error: err.message,
    });
  }
});

// READ ALL
app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to retrieve posts",
      error: err.message,
    });
  }
});

// READ BY ID
app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid post ID",
      error: err.message,
    });
  }
});

// UPDATE
app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to update post",
      error: err.message,
    });
  }
});

// DELETE
app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete post",
      error: err.message,
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express Test",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});