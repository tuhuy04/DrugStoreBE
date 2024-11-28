import { pool } from "../configs/database.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AppError,
} from "../utilities/errors.js";
import { LOCAL_HOST } from "../utilities/constants.js";


const medicineModel = {
  createOrUpdateMed: async (medications) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const results = {
        created: [],
        updated: [],
      };

      const [insertedImport] = await connection.execute(
        "INSERT INTO import_med (total_amount, import_date) VALUES (?, NOW())",
        [0]
      );

      const importId = insertedImport.insertId;
      let totalAmount = 0;

      for (const med of medications) {
        const {
          name,
          category_id,
          supplier_id,
          description,
          quantity,
          unit,
          cost_price,
          selling_price,
          image_url,
        } = med;

        if (
          !name ||
          !category_id ||
          !supplier_id ||
          !description ||
          !quantity ||
          !unit ||
          !cost_price ||
          !selling_price ||
          !image_url
        ) {
          throw new ValidationError(
            "All fields are required and must not be undefined."
          );
        }

        const [existingMed] = await connection.execute(
          "SELECT id, quantity, cost_price FROM medicine WHERE name = ?",
          [name]
        );

        if (existingMed.length > 0) {
          const medId = existingMed[0].id;

          const updatedQuantity =
            parseInt(existingMed[0].quantity) + parseInt(quantity);

          await connection.execute(
            "UPDATE medicine SET quantity = ?, updated_at = NOW() WHERE id = ?",
            [updatedQuantity, medId]
          );

          await connection.execute(
            "INSERT INTO import_med_detail (import_med_id, medicine_id, quantity, cost_price) VALUES (?, ?, ?, ?)",
            [importId, medId, quantity, cost_price]
          );

          totalAmount += quantity * cost_price;

          results.updated.push({
            id: medId,
            name,
            message: "Medicine quantity updated successfully",
          });
        } else {
          const [result] = await connection.execute(
            `INSERT INTO medicine (name, category_id, supplier_id, description, 
              quantity, unit, cost_price, selling_price, image_url, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              name,
              category_id,
              supplier_id,
              description,
              quantity,
              unit,
              cost_price,
              selling_price,
              image_url,
            ]
          );

          await connection.execute(
            "INSERT INTO import_med_detail (import_med_id, medicine_id, quantity, cost_price) VALUES (?, ?, ?, ?)",
            [importId, result.insertId, quantity, cost_price]
          );

          totalAmount += quantity * cost_price;

          results.created.push({
            id: result.insertId,
            name,
            message: "New medicine created successfully",
          });
        }
      }

      await connection.execute(
        "UPDATE import_med SET total_amount = ? WHERE id = ?",
        [totalAmount, importId]
      );

      await connection.commit();
      return results;
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
  },

  updateMed: async (id, data) => {
    const connection = await pool.getConnection();
    try {
      const [existingMed] = await connection.query(
        "SELECT id FROM medicine WHERE name = ? AND id != ?",
        [data.name, id]
      );
      if (existingMed.length > 0) {
        throw new ConflictError(
          "A medicine with the same name already exists."
        );
      }

      const [result] = await connection.execute(
        `UPDATE medicine SET 
        name = ?, category_id = ?, supplier_id = ?, description = ?, 
        unit = ?, cost_price = ?, selling_price = ?, image_url = ?, 
        updated_at = NOW()
      WHERE id = ?`,
        [
          data.name,
          data.category_id,
          data.supplier_id,
          data.description,
          data.unit,
          data.cost_price,
          data.selling_price,
          data.image_url,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        throw new NotFoundError("Medicine not found");
      }

      return { message: "Medicine updated successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating medicine: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },

  getMedById: async (id) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
           m.id,
           m.name,
           mc.category_name AS category,
           s.name AS supplier,
           m.description,
           m.quantity,
           m.unit,
           m.cost_price,
           m.selling_price,
           m.image_url,
           m.created_at,
           m.updated_at
         FROM medicine m
         LEFT JOIN medicine_category mc ON m.category_id = mc.id
         LEFT JOIN supplier s ON m.supplier_id = s.id
         WHERE m.id = ?`,
        [id]
      );
  
      if (rows.length === 0) {
        throw new NotFoundError("Medicine not found");
      }
  
      const medicine = rows[0];
      if (medicine.image_url) {
        medicine.image_url = `${LOCAL_HOST}/${medicine.image_url}`;
      }
  
      return medicine;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error retrieving medicine: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },
  
  

  getAllMed: async () => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
           m.id,
           m.name,
           mc.category_name AS category,
           s.name AS supplier,
           m.description,
           m.quantity,
           m.unit,
           m.cost_price,
           m.selling_price,
           m.image_url,
           m.created_at,
           m.updated_at
         FROM medicine m
         LEFT JOIN medicine_category mc ON m.category_id = mc.id
         LEFT JOIN supplier s ON m.supplier_id = s.id
         ORDER BY m.updated_at DESC`
      );
  
      rows.forEach(medicine => {
        if (medicine.image_url) {
          medicine.image_url = `${LOCAL_HOST}/${medicine.image_url}`;
        }
      });
  
      return rows;
    } catch (error) {
      throw new AppError(
        `Error retrieving medicines: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },
  
  
  deleteMed: async (id) => {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        "DELETE FROM medicine WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        throw new NotFoundError("Medicine not found");
      }

      return { message: "Medicine deleted successfully" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting medicine: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },

  checkStock: async () => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, name, quantity,
          CASE 
            WHEN quantity <= 5 THEN 'CRITICAL'
            WHEN quantity <= 10 THEN 'LOW'
            ELSE 'NORMAL'
          END as stock_status
          FROM medicine 
          WHERE quantity <= 10
          ORDER BY quantity ASC`
      );
      return rows;
    } catch (error) {
      throw new AppError(
        `Error checking stock: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },

  getMedByCategory: async (category_name) => {
    const connection = await pool.getConnection();
    try {
      const [categoryRows] = await connection.execute(
        `SELECT id FROM medicine_category WHERE category_name = ?`,
        [category_name]
      );

      if (categoryRows.length === 0) {
        throw new NotFoundError("Category not found");
      }

      const categoryId = categoryRows[0].id;
      const [medicineRows] = await connection.execute(
        `SELECT m.*, c.category_name 
          FROM medicine m 
          JOIN medicine_category c ON m.category_id = c.id 
          WHERE c.id = ?`,
        [categoryId]
      );

      return medicineRows;
    } catch (error) {
      throw new AppError(
        `Error retrieving medicine by category: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  },

  getMedByName: async (keyword) => {
    if (!keyword || keyword.trim() === "") {
      throw new AppError(
        "Keyword cannot be empty",
        HTTP_STATUS_CODE.BAD_REQUEST
      );
    }
  
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * 
          FROM medicine 
          WHERE name LIKE ?`,
        [`%${keyword}%`]
      );
      
      if (rows.length === 0) {
        return [];  
      }
  
      return rows;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error retrieving medicines by names: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
    }
  }
  
};

export { medicineModel };
