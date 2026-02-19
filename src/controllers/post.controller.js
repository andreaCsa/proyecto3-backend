const Post = require("../models/Post");


const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email role");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo posts", error: error.message });
  }
};


const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email role");
    if (!post) return res.status(404).json({ message: "Post no encontrado" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo post", error: error.message });
  }
};


const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const saved = await newPost.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ message: "Error creando post", error: error.message });
  }
};

// PUT /posts/:id
const updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Post no encontrado" });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Error actualizando post", error: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post no encontrado" });
    return res.status(200).json({ message: "Post eliminado" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando post", error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};