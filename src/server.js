import app from "./app.js";
import envConfig from "./config/env.config.js";

app.listen(
  envConfig.port,
  console.log(`servidor corriendo en el puerto ${envConfig.port}`),
);
