import { medicineService } from "../services/medicine.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import upload from "../middlewares/upload.js";

const createOrUpdateMed = async (req, res) => {
  try {
    const medications = req.body;
    const result = await medicineService.createOrUpdate(medications);

    res.status(HTTP_STATUS_CODE.OK).send({
      created: result.created,
      updated: result.updated,
      message: "Medicine creation and update completed.",
    });
  } catch (error) {
    console.error("Error in createOrUpdateMed:", error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await medicineService.update(id, data);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    console.error("Error in update:", error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

const deleteMed = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await medicineService.deleteById(id);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

const getMed = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await medicineService.getById(id);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

const getAllMed = async (req, res) => {
  try {
    const result = await medicineService.getAll();
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

export const medicineController = {
  // createNew,
  createOrUpdateMed,
  update,
  deleteMed,
  getMed,
  getAllMed,
};
