import { pool } from "../configs/database.js";
import { ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";


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

const getAllSuppliers = async () => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT * FROM supplier"
    );
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving suppliers: ${error.message}`,
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
