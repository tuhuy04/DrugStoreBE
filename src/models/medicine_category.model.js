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

const getAllCategories = async (keyword, id) => {
  const connection = await pool.getConnection();
  
  try {
    let query = `
      SELECT 
        mc.id AS category_id,
        mc.category_name,
        m.id AS medicine_id,
        m.name AS medicine_name,
        m.description,
        m.quantity,
        m.unit,
        m.cost_price,
        m.selling_price,
        m.image_url,
        m.created_at,
        m.updated_at
      FROM medicine_category mc
      LEFT JOIN medicine m ON m.category_id = mc.id
    `;
    
    let conditions = [];
    
    if (keyword) {
      conditions.push(`mc.category_name LIKE '%${keyword}%' OR m.name LIKE '%${keyword}%'`);
    }
    
    if (id) {
      conditions.push(`mc.id = ${id}`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY mc.category_name, m.updated_at DESC`;

    const [rows] = await connection.execute(query);

    const categories = [];
    rows.forEach((row) => {
      let category = categories.find(c => c.category_id === row.category_id);
      
      if (!category) {
        category = {
          category_id: row.category_id,
          category_name: row.category_name,
          medicines: []
        };
        categories.push(category);
      }

      if (row.medicine_id) {
        category.medicines.push({
          medicine_id: row.medicine_id,
          medicine_name: row.medicine_name,
          description: row.description,
          quantity: row.quantity,
          unit: row.unit,
          cost_price: row.cost_price,
          selling_price: row.selling_price,
          image_url: row.image_url ? `${LOCAL_HOST}/${row.image_url}` : null,
          created_at: row.created_at,
          updated_at: row.updated_at
        });
      }
    });

    return categories;
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
};
