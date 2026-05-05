const express = require("express");

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const authMiddleware = require("../middlewares/auth");

const postRoutes = express.Router();

//  Públicas
postRoutes.get("/", getPosts);
postRoutes.get("/:id", getPostById);

// Protegidas
postRoutes.post("/", authMiddleware, createPost);
postRoutes.put("/:id", authMiddleware, updatePost);
postRoutes.delete("/:id", authMiddleware, deletePost);

module.exports = postRoutes;