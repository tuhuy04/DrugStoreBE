"use strict";

import { pool } from "../configs/database.js";

const createOrUpdateMed = async (medications) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const results = {
      created: [],
      updated: [],
    };

    const [insertedImport] = await connection.execute(
      "INSERT INTO import_med ( total_amount, import_date) VALUES (?, NOW())",
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
        throw new Error("All fields are required and must not be undefined.");
      }

      const [existingMed] = await connection.execute(
        "SELECT id, quantity, cost_price FROM medicine WHERE name = ?",
        [name]
      );

      if (existingMed.length > 0) {
        const medId = existingMed[0].id;
        const updatedQuantity = existingMed[0].quantity + quantity;

        await connection.execute(
          "UPDATE medicine SET quantity = ?, updated_at = NOW() WHERE id = ?",
          [updatedQuantity, medId]
        );

        const costPrice = existingMed[0].cost_price;

        await connection.execute(
          "INSERT INTO import_med_detail (import_med_id, medicine_id, quantity, cost_price) VALUES (?, ?, ?, ?)",
          [importId, medId, quantity, costPrice]
        );

        totalAmount += quantity * costPrice;

        results.updated.push({
          id: medId,
          name,
          message: "Medicine quantity updated successfully",
        });
      } else {
        const [result] = await connection.execute(
          "INSERT INTO medicine (name, category_id, supplier_id, description, quantity, unit, cost_price, selling_price, image_url, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
          [
            name,
            category_id,
            supplier_id,
            description,
            quantity,
            unit,
            med.cost_price,
            med.selling_price,
            image_url,
          ]
        );

        const costPrice = med.cost_price;

        await connection.execute(
          "INSERT INTO import_med_detail (import_med_id, medicine_id, quantity, cost_price) VALUES (?, ?, ?, ?)",
          [importId, result.insertId, quantity, costPrice]
        );

        totalAmount += quantity * costPrice;

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
    throw error;
  } finally {
    connection.release();
  }
};

const updateMed = async (
  id,
  {
    name,
    category_id,
    supplier_id,
    description,
    unit,
    cost_price,
    selling_price,
    image_url,
  }
) => {
  const connection = await pool.getConnection();
  try {
    const [existingMed] = await connection.execute(
      "SELECT id FROM medicine WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingMed.length > 0) {
      throw new Error("A medicine with the same name already exists.");
    }

    const [result] = await connection.execute(
      "UPDATE medicine SET name = ?, category_id = ?, supplier_id = ?, description = ?, unit = ?, cost_price = ?, selling_price = ?, image_url = ?, updated_at = NOW() WHERE id = ?",
      [
        name || null,
        category_id || null,
        supplier_id || null,
        description || null,
        unit || null,
        cost_price || null,
        selling_price || null,
        image_url || null,
        id,
      ]
    );

    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const deleteMed = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM medicine WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const getMedById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM medicine WHERE id = ?",
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

const getAllMed = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM medicine");
    return rows;
  } finally {
    connection.release();
  }
};

const findMed = async ({ name, description }) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM medicine WHERE name = ? AND description = ?",
      [name, description]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

const importMed = async (id, quantity) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE medicine SET quantity = quantity + ? WHERE id = ?",
      [quantity, id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const sellMed = async (id, quantity) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "SELECT quantity FROM medicine WHERE id = ?",
      [id]
    );
    if (result.length === 0 || result[0].quantity < quantity) {
      throw new Error("Not enough stock to sell");
    }
    const [updateResult] = await connection.execute(
      "UPDATE medicine SET quantity = quantity - ? WHERE id = ?",
      [quantity, id]
    );
    return updateResult.affectedRows;
  } finally {
    connection.release();
  }
};

const isNameDuplicate = async (name, id = null) => {
  const connection = await pool.getConnection();
  try {
    const query = id
      ? "SELECT id FROM medicine WHERE name = ? AND id != ?"
      : "SELECT id FROM medicine WHERE name = ?";
    const params = id ? [name, id] : [name];
    const [rows] = await connection.execute(query, params);
    return rows.length > 0;
  } finally {
    connection.release();
  }
};

const getMedicineStock = async (medicineId) => {
  const connection = await pool.getConnection();
  try {
      const [rows] = await connection.execute(
          'SELECT quantity FROM medicine WHERE id = ?',
          [medicineId]
      );
      if (rows.length === 0) {
          throw new Error('Medicine not found');
      }
      return rows[0].quantity; 
  } finally {
      connection.release();
  }
};

export const medicineModel = {
  // createMed,
  createOrUpdateMed,
  updateMed,
  deleteMed,
  getMedById,
  getAllMed,
  findMed,
  importMed,
  sellMed,
  isNameDuplicate,
  getMedicineStock
};
