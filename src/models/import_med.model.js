"use strict";

import { pool } from "../configs/database.js";
import { ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { AppError } from "../utilities/errors.js";


const getAllMedImport = async () => {
  const connection = await pool.getConnection();
  try {
    const [importMeds] = await connection.execute(
      `SELECT * FROM import_med`
    );
    for (let i = 0; i < importMeds.length; i++) {
      const importMedId = importMeds[i].id;
      const [details] = await connection.execute(
        `SELECT id, medicine_id, quantity, cost_price 
         FROM import_med_detail 
         WHERE import_med_id = ?`,
        [importMedId]
      );
      importMeds[i].details = details;
    }
    return importMeds;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving med imports: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};

const getImportById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [importMed] = await connection.execute(
      `SELECT * FROM import_med WHERE id = ?`, 
      [id]
    );

    if (importMed.length === 0) {
      throw new AppError("Import record not found", HTTP_STATUS_CODE.NOT_FOUND);
    }

    const [details] = await connection.execute(
      `SELECT id, medicine_id, quantity, cost_price 
       FROM import_med_detail 
       WHERE import_med_id = ?`,
      [id]
    );

    importMed[0].details = details;
    return importMed[0];
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving import by ID: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};


const getImportByDate = async (startDate, endDate = null) => {
  const connection = await pool.getConnection();
  try {
    let query = `SELECT * FROM import_med WHERE `;
    let params = [];

    if (endDate) {
      query += `import_date BETWEEN ? AND ?`;
      params = [startDate, endDate];
    } else {
      query += `DATE(import_date) = ?`;
      params = [startDate];
    }

    const [importMeds] = await connection.execute(query, params);

    for (let i = 0; i < importMeds.length; i++) {
      const importMedId = importMeds[i].id;
      const [details] = await connection.execute(
        `SELECT id, medicine_id, quantity, cost_price 
         FROM import_med_detail 
         WHERE import_med_id = ?`,
        [importMedId]
      );
      importMeds[i].details = details;
    }

    return importMeds;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error retrieving import records by date: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  } finally {
    connection.release();
  }
};


export const importMedModel = {
  getAllMedImport,
  getImportById,
  getImportByDate,
};
