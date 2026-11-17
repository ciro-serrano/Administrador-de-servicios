import BookingManager from "../managers/BookingManager.js";
const manager = new BookingManager();
import ServiceManager from "../managers/ServiceManager.js";
const managerService = new ServiceManager();

export const createBooking = async (req, res) => {
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
};

export const getBookingById = async (req, res) => {
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
};

export const addServiceToBooking = async (req, res) => {
  try {
    //validamos primero reserva
    const bookingId = Number(req.params.bid);
    const booking = await manager.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    //Validamos servicio
    const serviceId = Number(req.params.sid);
    const service = await managerService.getServiceById(serviceId);
    //validamos que ese servicio exista
    if (!service) {
      return res.status(404).json({
        message: "Servicio no encontrado",
      });
    }

    const updateBooking = await manager.addServiceToBooking(
      bookingId,
      serviceId,
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
};
