import ServiceManager from "../managers/ServiceManager.js";
const manager = new ServiceManager();

export const getServices = async (req, res) => {
  try {
    const serviceFilter = await manager.getServices(req.query);
    res.status(200).json({
      message: "Servicios obtenidos con exito",
      payload: serviceFilter,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  const data = await manager.getServiceById(req.params.sid);
  if (!data) {
    return res.status(404).json({
      message: "no se encontro el servicio seleccionado",
    });
  }
  res.status(200).json({
    message: "success",
    payload: data,
  });
};

export const createService = async (req, res) => {
  try {
    const newService = await manager.addService(req.body);
    res.status(201).json({
      message: "servicio creado con exito",
      payload: newService,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  const serviceUpdate = await manager.updateService(req.params.sid, req.body);
  if (!serviceUpdate) {
    return res.status(404).json({
      message: "ningun servicio coincide con el id seleccionado",
    });
  }
  res.status(200).json({
    message: "servicio actualizado con exito",
    payload: serviceUpdate,
  });
};

export const deleteService = async (req, res) => {
  const delService = await manager.deleteService(req.params.sid);
  if (!delService) {
    return res.status(404).json({
      message: "no se encontro ningun elemento para eliminar",
    });
  }
  res.status(200).json({
    message: "servicio eliminado con exito",
    payload: delService,
  });
};
