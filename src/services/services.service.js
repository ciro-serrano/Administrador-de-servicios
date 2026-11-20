//el SERVICE QUEDA DESACOPLADO DE DONDE VIVEN LOS DATOS

import serviceRepository from "../repositories/services.repository.js";

class ServicesService {
  async getServices(filters = {}) {
    //desestructuramos el objeto filters
    const { category, available } = filters;
    if (available !== undefined) {
      if (available !== "true" && available !== "false") {
        const error = new Error(
          "ERROR: available solamente debe ser true o false",
        );
        error.status = 400;
        throw error;
      }
    }
    const services = await serviceRepository.getAll();
    let result = services;
    if (category) {
      result = result.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (available) {
      result = result.filter((s) => s.available === (available === "true"));
    }

    return result;
  }

  async getServiceById(id) {
    const service = await serviceRepository.getById(id);
    if (!service) {
      const error = new Error("no se encontro el servicio seleccionado");
      error.status = 404;
      throw error;
    }
    return service;
  }
  async createService(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      const error = new Error(
        "El body debe ser un objeto con los datos del servicio",
      );
      error.status = 400;
      throw error;
    }
    const camposRequeridos = [
      "name",
      "description",
      "duration",
      "price",
      "category",
      "available",
    ];
    const faltantes = camposRequeridos.filter((campo) => {
      return data[campo] === undefined;
    });
    if (faltantes.length > 0) {
      const error = new Error(
        `Faltan campos obligatorios. Faltantes: ${faltantes.join(", ")}`,
      );
      error.status = 400;
      throw error;
    }

    return await serviceRepository.create(data);
  }
  async updateService(id, data = {}) {
    //ignoramos el id del objeto data para no corromper la regla : "no se puede modificar el id"
    const { id: _ignorado, ...resto } = data;

    const updated = await serviceRepository.update(id, resto);
    if (!updated) {
      const error = new Error(
        "ningun servicio coincide con el id seleccionado",
      );
      error.status = 404;
      throw error;
    }
    return updated;
  }
  async deleteService(id) {
    const deleted = await serviceRepository.delete(id);
    if (!deleted) {
      const error = new Error("no se encontro ningun elemento para eliminar");
      error.status = 404;
      throw error;
    }

    return deleted;
  }
}

const servicesService = new ServicesService();
export default servicesService;
