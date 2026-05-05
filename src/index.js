const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const carRoutes = require("./routes/car.routes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/cars", carRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});