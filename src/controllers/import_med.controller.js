import { importMedService } from "../services/import_med.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../helpers/response.helper.js";

const getAllMedImport = async (req, res) => {
  try {
    const result = await importMedService.getAllMedImport();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getAllMedImport:", error);
    sendErrorResponse(res, error);
  }
};

const getImportById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await importMedService.getImportById(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getImportById:", error);
    sendErrorResponse(res, error);
  }
};

const getImportByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("Received startDate:", startDate);
    console.log("Received endDate:", endDate);
    const result = await importMedService.getImportByDate(startDate, endDate);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getImportByDate:", error);
    sendErrorResponse(res, error);
  }
};

export const importMedController = {
  getAllMedImport,
  getImportById,
  getImportByDate,
};
