import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

class BookingsDao {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.bookingPath = path.join(__dirname, "../data/bookings.json");
  }
  //leer
  async #readFile() {
    const data = await readFile(this.bookingPath, "utf-8");
    return JSON.parse(data);
  }
  //escribir
  async #writeFile(data) {
    await writeFile(this.bookingPath, JSON.stringify(data, null, 2), "utf-8");
  }

  async create(bookingData) {
    //generar Id
    const bookings = await this.#readFile();
    const newId =
      bookings.length === 0
        ? 1
        : Math.max(...bookings.map((booking) => booking.id)) + 1;
    //armamos el objeto
    const newBooking = {
      ...bookingData,
      id: newId,
    };
    bookings.push(newBooking);

    await this.#writeFile(bookings);
    return newBooking;
  }

  async getById(id) {
    const bookings = await this.#readFile();
    const bookingId = Number(id);
    const booking = bookings.find((b) => b.id === bookingId);
    return booking ?? null;
  }

  async update(id, data) {
    const bookings = await this.#readFile();
    const idNumber = Number(id);
    const indiceElement = bookings.findIndex((s) => s.id === idNumber);
    if (indiceElement === -1) return null;
    const updateElement = {
      ...bookings[indiceElement],
      ...data,
      id: idNumber,
    };
    bookings[indiceElement] = updateElement;

    await this.#writeFile(bookings);
    return updateElement;
  }
}
export default BookingsDao;
