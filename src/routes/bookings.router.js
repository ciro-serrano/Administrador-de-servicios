import { Router } from "express";
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

//post booking
router.post("/", createBooking);
//getBookingById
router.get("/:bid", getBookingById);
//addServiceToBooking
router.post("/:bid/services/:sid", addServiceToBooking);

export default router;
