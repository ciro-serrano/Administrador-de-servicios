import mongoose from "mongoose";
import { ServiceModel } from "../models/service.model.js";
class ServicesDao {
  async getAll() {
    return ServiceModel.find().lean();
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return ServiceModel.findById(id).lean();
  }

  async create(serviceData) {
    return (await ServiceModel.create(serviceData)).toObject();
  }

  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return ServiceModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    }).lean();
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return ServiceModel.findByIdAndDelete(id).lean();
  }
}

export default ServicesDao;
