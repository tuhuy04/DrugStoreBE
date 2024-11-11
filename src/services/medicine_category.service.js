import { categoryModel } from "../models/medicine_category.model.js";

const addCategory = async (name) => {
  try {
    const newCategoryId = await categoryModel.addCategory(name);
    return { id: newCategoryId, message: "Category added successfully" };
  } catch (error) {
    if (error.message === "Category already exists") {
      throw new Error(
        "Category already exists. Please choose a different name."
      );
    }
    throw new Error(`Error adding category: ${error.message}`);
  }
};

const updateCategory = async (id, name) => {
  try {
    const affectedRows = await categoryModel.updateCategory(id, name);
    if (affectedRows === 0) {
      throw new Error("Category not found");
    }
    return { message: "Category updated successfully" };
  } catch (error) {
    throw new Error(`Error updating category: ${error.message}`);
  }
};

const deleteCategory = async (id) => {
  try {
    const affectedRows = await categoryModel.deleteCategory(id);
    if (affectedRows === 0) {
      throw new Error("Category not found");
    }
    return { message: "Category deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

const getCategoryById = async (id) => {
  try {
    return await categoryModel.getCategoryById(id);
  } catch (error) {
    throw new Error(`Error retrieving category: ${error.message}`);
  }
};

const getAllCategories = async () => {
  try {
    return await categoryModel.getAllCategories();
  } catch (error) {
    throw new Error(`Error retrieving categories: ${error.message}`);
  }
};

export const categoryService = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
