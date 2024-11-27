import { medicineModel } from "../models/medicine.model.js";
import { ValidationError, AppError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { upload } from "../middlewares/upload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const medicineService = {
  createOrUpdate: async (medications) => {
    try {
      return await medicineModel.createOrUpdateMed(medications);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error in medicine service: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (id, data) => {
    try {
      const existingMedicine = await medicineModel.getMedById(id);
      if (!existingMedicine) {
        throw new NotFoundError("Medicine not found");
      }

      if (!Object.keys(data).length) {
        throw new ValidationError(
          "At least one field must be provided for update"
        );
      }

      let updatedImageUrl = existingMedicine.image_url;

      if (data.image_url) {
        const oldImagePath = path.resolve(
          __dirname,
          "../uploads/medicine",
          path.basename(existingMedicine.image_url)
        );

        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted:", oldImagePath);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        updatedImageUrl = data.image_url.replace(/\\/g, "/");
      }

      const updatedData = {
        name: data.name || existingMedicine.name,
        category_id: data.category_id || existingMedicine.category_id,
        supplier_id: data.supplier_id || existingMedicine.supplier_id,
        description: data.description || existingMedicine.description,
        unit: data.unit || existingMedicine.unit,
        cost_price: data.cost_price || existingMedicine.cost_price,
        selling_price: data.selling_price || existingMedicine.selling_price,
        image_url: updatedImageUrl,
      };

      const result = await medicineModel.updateMed(id, updatedData);

      return {
        message: "Medicine updated successfully",
        oldImageUrl: existingMedicine.image_url,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error in medicine service: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
  },

  deleteById: async (id) => {
    return await medicineModel.deleteMed(id);
  },

  getById: async (id) => {
    try {
      return await medicineModel.getMedById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error retrieving medicine: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
  },

  getAll: async () => {
    return await medicineModel.getAllMed();
  },

  checkStock: async () => {
    const lowStockItems = await medicineModel.checkStock();
    return {
      message:
        lowStockItems.length > 0
          ? "Some medicines are low in stock"
          : "All medicines are well-stocked",
      items: lowStockItems,
    };
  },

  getMedByCategory: async (category_name) => {
    try {
      return await medicineModel.getMedByCategory(category_name);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error retrieving medicine by category: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
  },

  getMedByName: async (keyword) => {
    try {
      const medicines = await medicineModel.getMedByName(keyword);
      return medicines;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error searching medicine by name: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
  },
};

export { medicineService };
