const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const cloudinary = require("../config/cloudinary");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo usuarios", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email y password son obligatorios" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Ya existe un usuario con ese email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename; 
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
      image: imageUrl,
      imagePublicId,
      posts: [],
    });

    const savedUser = await newUser.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: "Error creando usuario", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email y password son obligatorios" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ token, user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: "Error en login", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = rawId.replace(/"/g, "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando usuario", error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  login,
  deleteUser,
};