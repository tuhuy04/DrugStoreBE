import { pool } from "../configs/database.js";

const addSupplier = async ({ name, phone, email, location }) => {
  if (!name || !phone || !email || !location) {
    throw new Error("All fields are required and must not be undefined.");
  }

  const connection = await pool.getConnection();
  try {
    const exists = await checkSupplierExists(name);
    if (exists) {
      throw new Error("Supplier already exists");
    }

    const [result] = await connection.execute(
      "INSERT INTO supplier (name, phone, email, location) VALUES (?, ?, ?, ?)",
      [name, phone, email, location]
    );
    return result.insertId;
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
      throw new Error("A supplier with the same name already exists.");
    }
    const [result] = await connection.execute(
      "UPDATE supplier SET name = ?, phone = ?, email = ?, location = ? WHERE id = ?",
      [name || null, phone || null, email || null, location || null, id]
    );
    return result.affectedRows;
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
    const isMedicineExists = await checkMedicineBySupplier(id);
    if (isMedicineExists) {
      throw new Error(
        "Cannot delete supplier, because there are medicines linked to this supplier."
      );
    }

    const [result] = await connection.execute(
      "DELETE FROM supplier WHERE id = ?",
      [id]
    );
    return result.affectedRows;
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
    return result[0];
  } finally {
    connection.release();
  }
};

const getAllSuppliers = async () => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute("SELECT * FROM supplier");
    return result;
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
