const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

//  GET ALL
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "author",
      "username email role"
    );

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo posts",
      error: error.message,
    });
  }
};

// GET BY ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email role"
    );

    if (!post)
      return res.status(404).json({ message: "Post no encontrado" });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo post",
      error: error.message,
    });
  }
};

//  CREATE
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
      author: req.user._id, // 🔐 usar usuario autenticado
    });

    const savedPost = await newPost.save();

    // 🔐 Añadir post al usuario SIN DUPLICADOS
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

// UPDATE
const updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Post no encontrado" });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      message: "Error actualizando post",
      error: error.message,
    });
  }
};

// DELETE
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ message: "Post no encontrado" });

    // Solo autor o admin puede borrar
    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Post.findByIdAndDelete(id);

    // Quitar el post del array del usuario
    await User.findByIdAndUpdate(
      post.author,
      { $pull: { posts: id } }
    );

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