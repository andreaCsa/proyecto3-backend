const { upload } = require("../middlewares/upload");
const express = require("express");
const { getUsers, createUser, login, deleteUser } = require("../controllers/user.controller");
const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.post("/", upload.single("image"), createUser);
userRoutes.post("/login", login);
userRoutes.delete("/:id", deleteUser);

module.exports = userRoutes;