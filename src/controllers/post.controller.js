const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email role");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo posts",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email role"
    );

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo post",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title y content son obligatorios",
      });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user._id,
    });

    const savedPost = await newPost.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { posts: savedPost._id } },
      { new: true }
    );

    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(400).json({
      message: "Error creando post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("author", "username email role");

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      message: "Error actualizando post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(post.author, { $pull: { posts: id } });

    return res.status(200).json({ message: "Post eliminado" });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando post",
      error: error.message,
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
