import { medicineService } from "../services/medicine.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import upload from "../middlewares/upload.js";
import { sendSuccessResponse, sendErrorResponse } from "../helpers/response.helper.js";

const createOrUpdateMed = async (req, res) => {
  try {
    const medications = req.body;
    const result = await medicineService.createOrUpdate(medications);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in createOrUpdateMed:", error);
    sendErrorResponse(res, error);
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await medicineService.update(id, data);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in update:", error);
    sendErrorResponse(res, error);
  }
};

const deleteMed = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await medicineService.deleteById(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in deleteMed:", error);
    sendErrorResponse(res, error);
  }
};

const getMed = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await medicineService.getById(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getMed:", error);
    sendErrorResponse(res, error);
  }
};

const getAllMed = async (req, res) => {
  try {
    const result = await medicineService.getAll();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getAllMed:", error);
    sendErrorResponse(res, error);
  }
};

const sortByDate = async (req, res) => {
  try {
    const result = await medicineService.sortByDate();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in sortByDate:", error);
    sendErrorResponse(res, error);
  }
};

const sortByCategory = async (req, res) => {
  try {
    const result = await medicineService.sortByCategory();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in sortByCategory:", error);
    sendErrorResponse(res, error);
  }
};

const checkStock = async (req, res) => {
  try {
    const result = await medicineService.checkStock();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in checkStock:", error);
    sendErrorResponse(res, error);
  }
};


export const medicineController = {
  // createNew,
  createOrUpdateMed,
  update,
  deleteMed,
  getMed,
  getAllMed,
  sortByDate,
  sortByCategory,
  checkStock,
};
