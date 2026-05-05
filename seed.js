require("dotenv").config();
const mongoose = require("mongoose");
const Car = require("./src/models/Car");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo conectado");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await Car.deleteMany();

    await Car.insertMany([
      {
        brand: "Toyota",
        model: "Corolla",
        type: "Sedan",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
        link: "https://www.toyota.com/"
      },
      {
        brand: "BMW",
        model: "X5",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
        link: "https://www.bmw.com/"
      },
      {
        brand: "Tesla",
        model: "Model 3",
        type: "Electric",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        link: "https://www.tesla.com/"
      }
    ]);

    console.log("Seed de cars completada correctamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => seed());
