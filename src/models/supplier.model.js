import { pool } from "../configs/database.js";
import { ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";
import { LOCAL_HOST } from "../utilities/constants.js";


const addSupplier = async ({ name, phone, email, location }) => {
  const connection = await pool.getConnection();
  try {
    const exists = await checkSupplierExists(name);
    if (exists) {
      throw new ConflictError("Supplier already exists");
    }

    const [result] = await connection.execute(
      "INSERT INTO supplier (name, phone, email, location) VALUES (?, ?, ?, ?)",
      [name, phone, email, location]
    );
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error creating or updating supplier: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const checkSupplierExists = async (name) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT COUNT(*) AS count FROM supplier WHERE name = ?",
      [name]
    );
    return result[0].count > 0;
  } finally {
    connection.release();
  }
};

const updateSupplier = async (id, { name, phone, email, location }) => {
  const connection = await pool.getConnection();
  try {
    const [existingSupplier] = await connection.execute(
      "SELECT id FROM supplier WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingSupplier.length > 0) {
      throw new ConflictError("A supplier with the same name already exists.");
    }

    const [result] = await connection.execute(
      `UPDATE supplier SET 
      name = ?, phone = ?, email = ?, location = ?
      WHERE id = ?`,
      [name, phone, email, location, id]
    );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Supplier not found");
    }

    return { message: "Supplier updated successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error updating supplier: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};


const checkMedicineBySupplier = async (supplier_id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT COUNT(*) AS count FROM medicine WHERE supplier_id = ?",
      [supplier_id]
    );
    return result[0].count > 0;
  } finally {
    connection.release();
  }
};

const deleteSupplier = async (id) => {
  const connection = await pool.getConnection();
  try {
    const exists = await checkMedicineBySupplier(id);
    if (exists) {
      throw new ConflictError("Supplier has medicines associated with it");
    }

    const [result] = await connection.execute(
      "DELETE FROM supplier WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Supplier not found");
    }

    return { message: "Supplier deleted successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error deleting supplier: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const getSupplierById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT * FROM supplier WHERE id = ?",
      [id]
    );
    if (result.length === 0) {
      throw new NotFoundError("Supplier not found");
    }
    return result[0];
  }catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error deleting supplier: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }  finally {
    connection.release();
  }
}

const getAllSuppliers = async (keyword, id) => {
  const connection = await pool.getConnection();
  
  try {
    let query = `
      SELECT 
        s.id AS supplier_id,
        s.name AS supplier_name,
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
      FROM supplier s
      LEFT JOIN medicine m ON m.supplier_id = s.id
    `;
    
    let conditions = [];
    
    if (keyword) {
      conditions.push(`s.name LIKE '%${keyword}%' OR m.name LIKE '%${keyword}%'`);
    }
    
    if (id) {
      conditions.push(`s.id = ${id}`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY s.name, m.updated_at DESC`;

    const [rows] = await connection.execute(query);

    const suppliers = [];
    rows.forEach((row) => {
      let supplier = suppliers.find(s => s.supplier_id === row.supplier_id);
      
      if (!supplier) {
        supplier = {
          supplier_id: row.supplier_id,
          supplier_name: row.supplier_name,
          medicines: []
        };
        suppliers.push(supplier);
      }

      if (row.medicine_id) {
        supplier.medicines.push({
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

    return suppliers;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving suppliers with medicines: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

export const supplierModel = {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
};
