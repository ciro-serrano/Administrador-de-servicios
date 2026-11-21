import mongoose from "mongoose";
import envConfig from "./env.config.js";

async function connectDB() {
  try {
    await mongoose.connect(envConfig.mongoUri);
    console.log("conexion exitosa con la base de datos");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

export default connectDB;
