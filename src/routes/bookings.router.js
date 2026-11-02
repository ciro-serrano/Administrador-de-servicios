import { Router } from "express";
import BookingManager from "../managers/BookingManager.js";
const manager = new BookingManager();

const router = Router();

//post booking
router.post("/", async (req, res) => {
  try {
    const newBooking = await manager.createBooking(req.body);
    res.status(201).json({
      message: "reserva creada con exito",
      payload: newBooking,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
//getBookingById
router.get("/:bid", async (req, res) => {
  const booking = await manager.getBookingById(req.params.bid);
  if (!booking) {
    return res.status(404).json({
      message: "reserva no encontrada",
    });
  }
  res.status(200).json({
    message: "success",
    payload: booking,
  });
});
//addServiceToBooking
router.post("/:bid/services/:sid", async (req, res) => {
  try {
    const updateBooking = await manager.addServiceToBooking(
      req.params.bid,
      req.params.sid,
    );

    res.status(200).json({
      message: "Servicio agregado a la reserva con exito",
      payload: updateBooking,
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message,
    });
  }
});

export default router;
