import app from "./app.js";
import envConfig from "./config/env.config.js";
import connectDB from "./config/db.config.js";

async function startServer() {
  await connectDB();

  app.listen(envConfig.port, () => {
    console.log(`Servidor corriendo en el puerto ${envConfig.port}`);
  });
}

startServer();
