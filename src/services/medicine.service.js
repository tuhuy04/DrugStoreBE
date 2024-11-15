import { medicineModel } from "../models/medicine.model.js";
import { ValidationError, AppError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

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

      if (!data.name && !data.category_id && !data.description) {
        throw new ValidationError(
          "At least one field must be provided for update"
        );
      }

      const updatedData = {
        name: data.name || existingMedicine.name,
        category_id: data.category_id || existingMedicine.category_id,
        supplier_id: data.supplier_id || existingMedicine.supplier_id,
        description: data.description || existingMedicine.description,
        unit: data.unit || existingMedicine.unit,
        cost_price: data.cost_price || existingMedicine.cost_price,
        selling_price: data.selling_price || existingMedicine.selling_price,
        image_url: data.image_url || existingMedicine.image_url,
      };

      return await medicineModel.updateMed(id, updatedData);
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
    return await medicineModel.getMedById(id);
  },

  getAll: async () => {
    return await medicineModel.getAllMed();
  },

  sortByDate: async () => {
    return await medicineModel.sortByDate();
  },

  sortByCategory: async () => {
    return await medicineModel.sortByCategory();
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

  findByCategoryName: async (category_name) => {
    return await medicineModel.findByCategoryName(category_name);
  }
  
};


export { medicineService };
