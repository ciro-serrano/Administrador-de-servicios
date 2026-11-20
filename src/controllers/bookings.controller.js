import bookingService from "../services/bookings.service.js";

export const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.createBooking(req.body);
    return res.status(201).json({
      message: "reserva creada con exito",
      payload: newBooking,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.bid);
    return res.status(200).json({
      message: "success",
      payload: booking,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const updateBooking = await bookingService.addServiceToBooking(
      req.params.bid,
      req.params.sid,
    );
    return res.status(200).json({
      message: "Servicio agregado a la reserva con exito",
      payload: updateBooking,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
