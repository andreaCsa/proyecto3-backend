const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  login,
  updateUser,
  updateMyImage,
  deleteUser,
  updateUserRole,
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const { upload } = require("../middlewares/upload");

router.post("/register", upload.single("image"), createUser);
router.post("/login", login);

router.get("/", authMiddleware, isAdmin, getUsers);
router.put("/:id", authMiddleware, updateUser);
router.patch("/image/me", authMiddleware, upload.single("image"), updateMyImage);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/role/:id", authMiddleware, isAdmin, updateUserRole);

module.exports = router;
