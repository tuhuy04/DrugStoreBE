import { pool } from "../configs/database.js";
import { ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";
import { LOCAL_HOST } from "../utilities/constants.js";

const addCategory = async (category_name) => {
  const connection = await pool.getConnection();
  try {
    const exists = await checkCategoryExists(category_name);
    if (exists) {
      throw new ConflictError("Category already exists");
    }

    const [result] = await connection.execute(
      "INSERT INTO medicine_category (category_name) VALUES (?)",
      [category_name]
    );
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error creating or updating medicines: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const updateCategory = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const [existingMed] = await connection.execute(
      "SELECT id FROM medicine_category WHERE category_name = ? AND id != ?",
      [data.name, id]
    );

    if (existingMed.length > 0) {
      throw new ConflictError("A category with the same name already exists.");
    }

    const [result] = await connection.execute(
      `UPDATE medicine_category SET 
      category_name = ?
      WHERE id = ?`,
      [data.name, id]
    );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Category not found");
    }

    return { message: "Category updated successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error updating category: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const deleteCategory = async (id) => {
  const connection = await pool.getConnection();
  try {
    const isMedicineExists = await checkMedicineByCategory(id);
    if (isMedicineExists) {
      throw new ConflictError(
        "Cannot delete category, because there are medicines linked to this category."
      );
    }

    const [result] = await connection.execute(
      "DELETE FROM medicine_category WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError("Category not found");
    }
    return { message: "Category deleted successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving category: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    if (result.length === 0) {
      throw new NotFoundError("Category not found");
    }
    return result[0];
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving category: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const getAllCategories = async (params) => {
  const { keyword, id, page, pageSize } = params;

  const connection = await pool.getConnection();

  try {
    const conditions = [];
    const queryParams = [];

    if (keyword) {
      conditions.push("category_name LIKE ?");
      queryParams.push(`%${keyword}%`);
    }

    if (id) {
      conditions.push("id = ?");
      queryParams.push(id);
    }

    const countQuery = `
      SELECT COUNT(*) AS totalRecord
      FROM medicine_category
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
    `;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const totalRecord = countResult[0].totalRecord;

    const offset = (page - 1) * pageSize;

    let query = `
      SELECT * FROM medicine_category
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
      ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}
    `;
    
    const [rows] = await connection.execute(query, queryParams);

    return {
      totalRecord, 
      rows, 
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving categories with medicines: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const getAllCategoryWithProduct = async () => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `SELECT mc.id, mc.category_name, COUNT(m.id) AS total_medicine 
      FROM medicine_category mc
      LEFT JOIN medicine m ON mc.id = m.category_id
      GROUP BY mc.id
      HAVING total_medicine > 0`
    );
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving categories with medicines: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
}


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

const checkMedicineByCategory = async (category_id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT COUNT(*) AS count FROM medicine WHERE category_id = ?",
      [category_id]
    );
    return result[0].count > 0;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving medicines: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
  getAllCategoryWithProduct,
};
