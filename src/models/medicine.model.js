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
          !selling_price
          || !image_url
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
              quantity, unit, cost_price, selling_price,  
              created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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
      // Kiểm tra tên thuốc trùng lặp
      const [existingMed] = await connection.query(
        "SELECT id FROM medicine WHERE name = ? AND id != ?",
        [data.name, id]
      );
      if (existingMed.length > 0) {
        throw new ConflictError("A medicine with the same name already exists.");
      }
  
      // Tạo mảng chứa cặp trường và giá trị
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      values.push(id); // Thêm `id` vào cuối mảng cho câu WHERE
  
      // Chạy câu SQL chỉ với các trường cần cập nhật
      const [result] = await connection.execute(
        `UPDATE medicine SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
        values
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

  getAllMed: async (params) => {
    const {
      keyword,
      id,
      category_id,
      supplier,
      min_price,
      max_price,
      page,
      pageSize,
    } = params;

    const connection = await pool.getConnection();

    try {
      const conditions = [];
      const queryParams = [];

      if (id) {
        conditions.push("m.id = ?");
        queryParams.push(id);
      }
      if (keyword) {
        conditions.push("(m.name LIKE ? OR m.description LIKE ?)");
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (category_id) {
        conditions.push("mc.id = ?");
        queryParams.push(category_id);
      }
      if (supplier) {
        conditions.push("s.name LIKE ?");
        queryParams.push(`%${supplier}%`);
      }
      if (min_price !== undefined) {
        conditions.push("m.selling_price >= ?");
        queryParams.push(min_price);
      }
      if (max_price !== undefined) {
        conditions.push("m.selling_price <= ?");
        queryParams.push(max_price);
      }

      const countQuery = `
            SELECT COUNT(*) AS totalRecord
            FROM medicine m
            LEFT JOIN medicine_category mc ON m.category_id = mc.id
            LEFT JOIN supplier s ON m.supplier_id = s.id
            ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
        `;
      const [countResult] = await connection.execute(countQuery, queryParams);
      const totalRecord = countResult[0].totalRecord;

      const offset = (page - 1) * pageSize;

      const query = `
            SELECT 
                m.id, m.name, mc.category_name AS category, s.name AS supplier,
                m.description, m.quantity, m.unit, m.cost_price, m.selling_price,
                m.image_url, m.created_at, m.updated_at
            FROM medicine m
            LEFT JOIN medicine_category mc ON m.category_id = mc.id
            LEFT JOIN supplier s ON m.supplier_id = s.id
            ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
            ORDER BY m.created_at DESC LIMIT ${pageSize} OFFSET ${offset}
        `;

      const [rows] = await connection.execute(query, queryParams);

      rows.forEach((medicine) => {
        if (medicine.image_url) {
          medicine.image_url = `${LOCAL_HOST}/${medicine.image_url}`;
        }
      });

      return { totalRecord, rows };
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
  },
  getMedicineStock: async (medicineId) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT quantity FROM medicine WHERE id = ?",
        [medicineId]
      );
      if (rows.length === 0) {
        throw new Error("Medicine not found");
      }
      return rows[0].quantity;
    } finally {
      connection.release();
    }
  },
};

export { medicineModel };
