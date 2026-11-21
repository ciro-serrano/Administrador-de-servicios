import { BookingModel } from "../models/booking.model.js";
import mongoose from "mongoose";

class BookingsDao {
  async create(bookingData) {
    return (await BookingModel.create(bookingData)).toObject();
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return BookingModel.findById(id).lean();
  }

  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return BookingModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    }).lean();
  }
}
export default BookingsDao;
