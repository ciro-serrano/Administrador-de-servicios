import bookingRepository from "../repositories/bookings.repository.js";
import serviceRepository from "../repositories/services.repository.js";

class BookingsService {
  async createBooking(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      const error = new Error(
        "El body debe ser un objeto con los datos de la reserva",
      );
      error.status = 400;
      throw error;
    }

    const { _id: _ignorado, status, ...datos } = data;
    const bookingStatus = status || "pending";

    if (!datos.clientName || !datos.clientEmail || !datos.date || !datos.time) {
      const error = new Error("Faltan campos obligatorios");
      error.status = 400;
      throw error;
    }

    const newData = {
      ...datos,
      status: bookingStatus,
      services: [],
    };

    const created = await bookingRepository.create(newData);
    return created;
  }

  async getBookingById(id) {
    const booking = await bookingRepository.getById(id);
    if (!booking) {
      const error = new Error("reserva no encontrada");
      error.status = 404;
      throw error;
    }
    return booking;
  }
  async addServiceToBooking(bookingId, serviceId) {
    //validamos reserva
    const booking = await bookingRepository.getById(bookingId);
    if (!booking) {
      const error = new Error("Reserva no encontrada");
      error.status = 404;
      throw error;
    }

    //validamos servicio

    const service = await serviceRepository.getById(serviceId);
    if (!service) {
      const error = new Error("Servicio no encontrado");
      error.status = 404;
      throw error;
    }
    const sid = service._id;
    //buscamos una entrada
    const entry = booking.services.find(
      (s) => s.service.toString() === sid.toString(),
    );
    if (entry) {
      entry.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }
    return await bookingRepository.update(bookingId, {
      services: booking.services,
    });
  }
}

const bookingService = new BookingsService();
export default bookingService;
