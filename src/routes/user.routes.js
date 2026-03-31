const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  login,
  updateUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Público
router.post("/register", createUser);
router.post("/login", login);

// Protegidas
router.get("/", authMiddleware, getUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/role/:id", authMiddleware, isAdmin, updateUserRole);

module.exports = router;