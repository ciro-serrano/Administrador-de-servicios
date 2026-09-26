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
  async getServices() {
    const data = await readFile(this.servicesPath, "utf-8");
    return JSON.parse(data);
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

    const faltantes = camposRequeridos.filter((campo) => {
      return serviceData[campo] === undefined;
    });

    if (faltantes.length > 0) {
      throw new Error(
        `Error: Falta agregar campos\nFaltantes: ${faltantes.join(", ")}`,
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
}

const manager = new ServiceManager();

export default ServiceManager;
