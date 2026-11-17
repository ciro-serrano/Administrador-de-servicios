import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

class ServiceManager {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.servicesPath = path.join(__dirname, "..", "data", "services.json");
  }
  //get --GET
  async getServices(filters = {}) {
    const { category, available } = filters;
    const data = await readFile(this.servicesPath, "utf-8");
    let result = JSON.parse(data);

    if (category) {
      result = result.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (available !== undefined) {
      if (available !== "true" && available !== "false") {
        throw new Error("ERROR: available solamente debe ser true o false");
      }
      result = result.filter((s) => s.available === (available === "true"));
    }
    return result;
  }
  //getId --GETid
  async getServiceById(id) {
    const serviceId = Number(id);
    const data = await this.getServices();
    const element = data.find((s) => s.id === serviceId);
    return element ? element : null;
  }
  //add --POST
  async addService(serviceData) {
    const camposRequeridos = [
      "name",
      "description",
      "duration",
      "price",
      "category",
      "available",
    ];
    if (
      typeof serviceData !== "object" ||
      serviceData === null ||
      Array.isArray(serviceData)
    ) {
      throw new Error(`El body debe ser un objeto con los datos del servicio`);
    }
    const faltantes = camposRequeridos.filter((campo) => {
      return serviceData[campo] === undefined;
    });

    if (faltantes.length > 0) {
      throw new Error(
        `Error: Falta agregar campos. --- Faltantes: ${faltantes.join(", ")}`,
      );
    }
    //generar id
    const services = await this.getServices();
    const newId =
      services.length === 0
        ? 1
        : Math.max(...services.map((service) => service.id)) + 1;

    //newServicio
    const nuevoServicio = {
      ...serviceData,
      id: newId,
    };

    services.push(nuevoServicio);

    const writeElement = await writeFile(
      this.servicesPath,
      JSON.stringify(services, null, 2),
      "utf-8",
    );

    return nuevoServicio;
  }
  //actualizar servicio existente --PUT
  async updateService(id, updateData) {
    const services = await this.getServices();
    const idNumber = Number(id);

    const indiceElement = services.findIndex((s) => s.id === idNumber);

    if (indiceElement === -1) return null;
    const updateElement = {
      ...services[indiceElement],
      ...updateData,
      id: idNumber,
    };
    services[indiceElement] = updateElement;
    const writeElement = await writeFile(
      this.servicesPath,
      JSON.stringify(services, null, 2),
      "utf-8",
    );
    return updateElement;
  }
  //DELETE
  async deleteService(id) {
    const idNumber = Number(id);
    const services = await this.getServices();
    const indexElement = services.findIndex((s) => s.id === idNumber);
    if (indexElement === -1) {
      return null;
    }
    const elementDelete = services.splice(indexElement, 1);
    const writeElement = await writeFile(
      this.servicesPath,
      JSON.stringify(services, null, 2),
      "utf-8",
    );
    return elementDelete[0];
  }
  async filterService() {}
}

export default ServiceManager;
