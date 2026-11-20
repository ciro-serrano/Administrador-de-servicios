//cada handler lee el REQ, llama al service correspondiente, y responde con RES
import servicesService from "../services/services.service.js";

export const getServices = async (req, res) => {
  try {
    const serviceFilter = await servicesService.getServices(req.query);
    return res.status(200).json({
      message: "Servicios obtenidos con exito",
      payload: serviceFilter,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const data = await servicesService.getServiceById(req.params.sid);
    return res.status(200).json({
      message: "success",
      payload: data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = await servicesService.createService(req.body);
    return res.status(201).json({
      message: "servicio creado con exito",
      payload: newService,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const updated = await servicesService.updateService(
      req.params.sid,
      req.body,
    );
    return res.status(200).json({
      message: "servicio actualizado con exito",
      payload: updated,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deleted = await servicesService.deleteService(req.params.sid);
    return res.status(200).json({
      message: "servicio eliminado con exito",
      payload: deleted,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
