import envConfig from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

const manager = new ServiceManager();
//get
console.log("--Servicios iniciales--");
console.log(await manager.getServices());

//getId
console.log("-- Buscar servicio por id --");
console.log(await manager.getServiceById(1));
console.log(await manager.getServiceById(999));

//post
console.log("-- Agregar un nuevo servicio --");
const nuevo = await manager.addService({
  name: "perfilado de cejas",
  description:
    "con el uso de una navaja depilar cuidadosamente la zona de cejas",
  duration: 10,
  price: 10000,
  category: "Barberia",
  available: true,
});
console.log(nuevo);

//put
console.log("-- Actualizar el servicio creado --");
console.log(await manager.updateService(nuevo.id, { available: false }));

//delete
console.log("-- Eliminar el servicio creado --");
console.log(await manager.deleteService(nuevo.id));

//manejo de error
console.log("--intentar agregar un servicio incompleto");
try {
  await manager.addService({
    name: "servicio a medias",
  });
} catch (error) {
  console.log("Error capturado: ", error.message);
}

console.log("-- Servicios finales --");
console.log(await manager.getServices());
