const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("posts");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error obteniendo usuarios",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email y password son obligatorios",
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese email o username",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const newUser = new User({
      username,
      email,
      password,
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email y password son obligatorios",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const ok = await user.comparePassword(password);
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.body.role && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No puedes cambiar el rol desde esta ruta",
      });
    }

    if (req.body.username !== undefined) userToUpdate.username = req.body.username;
    if (req.body.email !== undefined) userToUpdate.email = req.body.email;
    if (req.body.password !== undefined) userToUpdate.password = req.body.password;

    const updatedUser = await userToUpdate.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.status(200).json(userResponse);
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando usuario",
      error: error.message,
    });
  }
};

const updateMyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debes subir una imagen" });
    }

    const user = await User.findById(req.user._id);

    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    user.image = req.file.path;
    user.imagePublicId = req.file.filename;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(userResponse);
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando imagen",
      error: error.message,
    });
  }
};

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

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
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

    if (req.user._id.toString() === id) {
      return res.status(403).json({
        message: "Un admin no puede cambiarse su propio rol",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Rol no válido",
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
  updateMyImage,
  deleteUser,
  updateUserRole,
};
