import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

class BookingManager {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.bookingPath = path.join(__dirname, "../data/bookings.json");
  }

  //escribir
  async #writeFile(data) {
    await writeFile(this.bookingPath, JSON.stringify(data, null, 2), "utf-8");
  }

  //leer
  async #readFile() {
    const data = await readFile(this.bookingPath, "utf-8");
    return JSON.parse(data);
  }

  async createBooking(bookingData) {
    if (
      typeof bookingData !== "object" ||
      bookingData === null ||
      Array.isArray(bookingData)
    ) {
      throw new Error(`El body debe ser un objeto con los datos de la reserva`);
    }

    const { clientName, clientEmail, date, time, status } = bookingData;

    const bookingStatus = status || "pending";

    if (!clientName || !clientEmail || !date || !time) {
      throw new Error("Faltan campos obligatorios");
    }

    //generar Id
    const bookings = await this.#readFile();
    const newId =
      bookings.length === 0
        ? 1
        : Math.max(...bookings.map((booking) => booking.id)) + 1;

    const newBooking = {
      ...bookingData,
      services: [],
      status: bookingStatus,
      id: newId,
    };

    bookings.push(newBooking);
    await this.#writeFile(bookings);
    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this.#readFile();
    const bookingId = Number(id);
    const booking = bookings.find((b) => b.id === bookingId);
    return booking ? booking : null;
  }

  async addServiceToBooking(bid, sid) {
    //llamamos al array de bookings
    const bookings = await this.#readFile();
    //obtenemos el indice [0] donde se encuentra la reserva que buscamos
    const bookingIndex = bookings.findIndex((b) => b.id === bid);

    //instanciamos la reserva que obtuvimos mediante su indice
    const booking = bookings[bookingIndex];
    //buscamos la primera entrada al array de services
    const entry = booking.services.find((s) => s.service === sid);

    if (entry) {
      entry.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    await this.#writeFile(bookings);
    return booking;
  }
}

export default BookingManager;
