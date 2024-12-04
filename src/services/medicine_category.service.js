import { categoryModel } from "../models/medicine_category.model.js";
import { ValidationError, NotFoundError, ConflictError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";

const addCategory = async (name) => {
  try {
    const newCategoryId = await categoryModel.addCategory(name);
    return { id: newCategoryId, message: "Category added successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error in category service: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const updateCategory = async (id, data) => {
  try {
    const existingCategory = await categoryModel.getCategoryById(id);

    if (!data.name) {
      throw new ValidationError(
        "At least one field must be provided for update"
      );
    }

    const updatedData = {
      name: data.name || existingCategory.name,
    };

    return await categoryModel.updateCategory(id, updatedData);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error in category service: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

const deleteCategory = async (id) => {
  try {
    const affectedRows = await categoryModel.deleteCategory(id);
    if (affectedRows === 0) {
      throw new NotFoundError("Category not found");
    }
    return { message: "Category deleted successfully" };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error; 
    }
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

const getCategoryById = async (id) => {
  try {
    return await categoryModel.getCategoryById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error(`Error retrieving category: ${error.message}`);
  }
};

const getAllCategories = async (req) => {
  const { keyword, id } = req.query; 

  try {
    const categories = await categoryModel.getAllCategories(keyword, id);
    
    return categories;
  } catch (error) {
    throw new Error(`Error in getCategoriesWithMedicines service: ${error.message}`);
  }
};

export const categoryService = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
