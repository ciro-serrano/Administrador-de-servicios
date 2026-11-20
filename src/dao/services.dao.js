import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

class ServicesDao {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.servicesPath = path.join(__dirname, "..", "data", "services.json");
  }
  //escribir
  async #writeFile(data) {
    await writeFile(this.servicesPath, JSON.stringify(data, null, 2), "utf-8");
  }

  //leer
  async #readFile() {
    const data = await readFile(this.servicesPath, "utf-8");
    return JSON.parse(data);
  }

  async getAll() {
    return await this.#readFile();
  }

  async getById(id) {
    const serviceId = Number(id);
    const data = await this.getAll();
    const element = data.find((s) => s.id === serviceId);
    return element ?? null;
  }

  async create(serviceData) {
    //generar id
    const services = await this.getAll();
    const newId =
      services.length === 0
        ? 1
        : Math.max(...services.map((service) => service.id)) + 1;
    //armamos el objeto
    const nuevoServicio = {
      ...serviceData,
      id: newId,
    };
    services.push(nuevoServicio);
    await this.#writeFile(services);
    return nuevoServicio;
  }

  async update(id, data) {
    const services = await this.getAll();
    const idNumber = Number(id);
    const indiceElement = services.findIndex((s) => s.id === idNumber);
    if (indiceElement === -1) return null;
    const updateElement = {
      ...services[indiceElement],
      ...data,
      id: idNumber,
    };
    services[indiceElement] = updateElement;

    await this.#writeFile(services);
    return updateElement;
  }

  async delete(id) {
    const idNumber = Number(id);
    const services = await this.getAll();
    const indexElement = services.findIndex((s) => s.id === idNumber);
    if (indexElement === -1) {
      return null;
    }
    const elementDelete = services.splice(indexElement, 1);
    await this.#writeFile(services);
    return elementDelete[0];
  }
}

export default ServicesDao;
