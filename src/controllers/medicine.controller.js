import { medicineService } from "../services/medicine.service.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../helpers/response.helper.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const medicineController = {
  createOrUpdateMed: async (req, res) => {
    try {
      const file = req.file;
      const medications = req.body;

      if (!file) {
        throw new ValidationError("Image file is required!");
      }

      const relativeImagePath = `uploads/medicine/${file.filename}`;
      medications.image_url = relativeImagePath;

      console.log("Medication data:", req.body);

      const result = await medicineService.createOrUpdate([medications]);
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

      if (req.file) {
        data.image_url = `uploads/medicine/${req.file.filename}`;
      }

      const result = await medicineService.update(id, data);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in update:", error);

      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log("Uploaded image removed:", req.file.path);
        } catch (fsError) {
          console.error("Error removing uploaded image:", fsError);
        }
      }
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
      const { keyword, id, category, supplier, min_price, max_price } =
        req.query;

      const params = {
        keyword,
        id: id ? parseInt(id, 10) : undefined,
        category,
        supplier,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
      };

      console.log("Query Params:", params);
      const result = await medicineService.getAll(params);
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
      const category_name = req.params.category_name;
      const result = await medicineService.getMedByCategory(category_name);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in getMedByCategoryName:", error);
      sendErrorResponse(res, error);
    }
  },

  getMedByName: async (req, res) => {
    try {
      const { keyword } = req.query; //
      const result = await medicineService.getMedByName(keyword);
      sendSuccessResponse(res, result);
    } catch (error) {
      console.error("Error in searchMedicineByName:", error);
      sendErrorResponse(res, error);
    }
  },
};

export { medicineController };
