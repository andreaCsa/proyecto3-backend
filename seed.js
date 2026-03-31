require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./src/models/User");
const Post = require("./src/models/Post");

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
    await User.deleteMany();
    await Post.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      posts: [],
    });

    const user = await User.create({
      username: "user",
      email: "user@test.com",
      password: hashedPassword,
      role: "user",
      posts: [],
    });

    const post1 = await Post.create({
      title: "Primer post",
      content: "Contenido de prueba",
      author: admin._id,
    });

    const post2 = await Post.create({
      title: "Segundo post",
      content: "Contenido del usuario",
      author: user._id,
    });

    // Añadir posts a los usuarios sin duplicados
    await User.findByIdAndUpdate(admin._id, {
      $addToSet: { posts: post1._id },
    });

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { posts: post2._id },
    });

    console.log("Seed completada correctamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => seed());