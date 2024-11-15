import { medicineService } from "../services/medicine.service.js";
import { sendSuccessResponse, sendErrorResponse } from "../helpers/response.helper.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";


const medicineController = {
  createOrUpdateMed: async (req, res) => {
    try {
      const medications = req.body;
      const result = await medicineService.createOrUpdate(medications);
      sendSuccessResponse(res, result, HTTP_STATUS_CODE.CREATED);
    } catch (error) {
      console.error("Error in createOrUpdateMed:", error);
      sendErrorResponse(res, error);
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const result = await medicineService.update(id, data);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in update:", error);
      sendErrorResponse(res, error);
    }
  },

  deleteMed: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await medicineService.deleteById(id);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in deleteMed:", error);
      sendErrorResponse(res, error);
    }
  },

  getMed: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await medicineService.getById(id);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in getMed:", error);
      sendErrorResponse(res, error);
    }
  },

  getAllMed: async (req, res) => {
    try {
      const result = await medicineService.getAll();
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in getAllMed:", error);
      sendErrorResponse(res, error);
    }
  },

  sortByDate: async (req, res) => {
    try {
      const result = await medicineService.sortByDate();
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in sortByDate:", error);
      sendErrorResponse(res, error);
    }
  },

  sortByCategory: async (req, res) => {
    try {
      const result = await medicineService.sortByCategory();
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in sortByCategory:", error);
      sendErrorResponse(res, error);
    }
  },

  checkStock: async (req, res) => {
    try {
      const result = await medicineService.checkStock();
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in checkStock:", error);
      sendErrorResponse(res, error);
    }
  },

  getMedByCategory: async (req, res) => {
    try {
      const name = req.params.name;
      const result = await medicineService.getMedByCategory(name);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in getMedByCategory:", error);
      sendErrorResponse(res, error);
    }
  },

  getMedByCategoryName: async (req, res) => {
    try {
      const name = req.params.name;
      const result = await medicineService.findByCategoryName(name);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in getMedByCategoryName:", error);
      sendErrorResponse(res, error);
    }
  }
}  


export {medicineController} ;