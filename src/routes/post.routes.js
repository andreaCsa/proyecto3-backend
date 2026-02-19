const express = require("express");
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const postRoutes = express.Router();

postRoutes.get("/", getPosts);
postRoutes.get("/:id", getPostById);
postRoutes.post("/", createPost);
postRoutes.put("/:id", updatePost);
postRoutes.delete("/:id", deletePost);

module.exports = postRoutes;