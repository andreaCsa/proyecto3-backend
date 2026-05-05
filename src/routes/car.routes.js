

const express = require("express");
const router = express.Router();

const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

const authMiddleware = require("../middlewares/auth");

// Públicas
router.get("/", getCars);
router.get("/:id", getCarById);

// Protegidas
router.post("/", authMiddleware, createCar);
router.put("/:id", authMiddleware, updateCar);
router.delete("/:id", authMiddleware, deleteCar);

module.exports = router;