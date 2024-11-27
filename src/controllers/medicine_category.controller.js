import { categoryService } from "../services/medicine_category.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { ValidationError, NotFoundError, ConflictError } from "../utilities/errors.js";
import { sendErrorResponse, sendSuccessResponse } from "../helpers/response.helper.js";


const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await categoryService.addCategory(name);
    sendSuccessResponse(res, result, HTTP_STATUS_CODE.CREATED);
  } catch (error) {
    console.error("Error in createOrUpdateMed:", error);
    sendErrorResponse(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await categoryService.updateCategory(id, data);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in update:", error);
    sendErrorResponse(res, error);
  }
}

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await categoryService.deleteCategory(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in delete category:", error);
    sendErrorResponse(res, error);
  }
}

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await categoryService.getCategoryById(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in get category:", error);
    sendErrorResponse(res, error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in get all category:", error);
    sendErrorResponse(res, error);
  }
};

export const categoryController = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
