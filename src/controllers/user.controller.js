const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo usuarios",
      error: error.message,
    });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email y password son obligatorios",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese email",
      });
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
    return res.status(500).json({
      message: "Error creando usuario",
      error: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email y password son obligatorios",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en login",
      error: error.message,
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== id
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando usuario",
      error: error.message,
    });
  }
};

//  Eliminar usuario (CON PROTECCIÓN REAL)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Solo admin o el propio usuario
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== id
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (userToDelete.imagePublicId) {
      await cloudinary.uploader.destroy(userToDelete.imagePublicId);
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando usuario",
      error: error.message,
    });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo admin puede cambiar roles",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando rol",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  login,
  updateUser,
  deleteUser,
  updateUserRole,
};