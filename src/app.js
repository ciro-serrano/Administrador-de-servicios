import express from "express";
import router from "./routes/services.router.js";

const app = express();
app.use(express.json());
app.use("/api/services", router);

export default app;
