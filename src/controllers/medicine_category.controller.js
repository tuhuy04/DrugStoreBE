import { categoryService } from "../services/medicine_category.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await categoryService.addCategory(name);
    res.status(HTTP_STATUS_CODE.CREATED).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const result = await categoryService.updateCategory(id, name);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {     
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await categoryService.deleteCategory(id);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await categoryService.getCategoryById(id);
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(HTTP_STATUS_CODE.OK).send(result);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: error.message,
    });
  }
};

export const categoryController = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
