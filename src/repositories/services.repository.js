import ServicesDao from "../dao/services.dao.js";

class ServicesRepository {
  constructor() {
    this.dao = new ServicesDao();
  }
  async getAll() {
    return await this.dao.getAll();
  }
  async getById(id) {
    return await this.dao.getById(id);
  }
  async create(data) {
    return await this.dao.create(data);
  }
  async update(id, data) {
    return await this.dao.update(id, data);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

const serviceRepository = new ServicesRepository();

export default serviceRepository;
