import { pool } from "../configs/database.js";

const addCategory = async (category_name) => {
  const connection = await pool.getConnection();
  try {
    const exists = await checkCategoryExists(category_name);
    if (exists) {
      throw new Error("Category already exists");
    }

    const [result] = await connection.execute(
      "INSERT INTO medicine_category (category_name) VALUES (?)",
      [category_name]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

const updateCategory = async (id, category_name) => {
  const connection = await pool.getConnection();
  try {
    const [existingCategory] = await connection.execute(
      "SELECT id FROM medicine_category WHERE category_name = ? AND id != ?",
      [category_name, id]
    );
    if (existingCategory.length > 0) {
      throw new Error("A category with the same name already exists.");
    }
    const [result] = await connection.execute(
      "UPDATE medicine_category SET category_name = ? WHERE id = ?",
      [category_name, id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};


const checkMedicineByCategory = async (category_id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT COUNT(*) AS count FROM medicine WHERE category_id = ?",
      [category_id]
    );
    return result[0].count > 0;
  } finally {
    connection.release();
  }
};

const deleteCategory = async (id) => {
  const connection = await pool.getConnection();
  try {
    const isMedicineExists = await checkMedicineByCategory(id);
    if (isMedicineExists) {
      throw new Error(
        "Cannot delete category, because there are medicines linked to this category."
      );
    }

    const [result] = await connection.execute(
      "DELETE FROM medicine_category WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const getCategoryById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT * FROM medicine_category WHERE id = ?",
      [id]
    );
    return result[0];
  } finally {
    connection.release();
  }
};

const getAllCategories = async () => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT * FROM medicine_category"
    );
    return result;
  } finally {
    connection.release();
  }
};

const checkCategoryExists = async (category_name) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT COUNT(*) AS count FROM medicine_category WHERE category_name = ?",
      [category_name]
    );
    return result[0].count > 0;
  } finally {
    connection.release();
  }
};

export const categoryModel = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
