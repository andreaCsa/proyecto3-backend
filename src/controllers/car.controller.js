

const Car = require("../models/Car");

// CREATE
const createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    return res.status(201).json(savedCar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// READ ALL
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// READ ONE
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car no encontrado" });
    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCar) return res.status(404).json({ message: "Car no encontrado" });
    return res.status(200).json(updatedCar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: "Car no encontrado" });
    return res.status(200).json({ message: "Car eliminado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};