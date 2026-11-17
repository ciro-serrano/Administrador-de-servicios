import { Router } from "express";

//import controller
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";

const router = Router();
//getservices && filtros
router.get("/", getServices);

//getservicesById
router.get("/:sid", getServiceById);

//postservice
router.post("/", createService);

//putService
router.put("/:sid", updateService);

//deleteservice
router.delete("/:sid", deleteService);

export default router;
