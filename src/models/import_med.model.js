"use strict";

import { pool } from "../configs/database.js";

const getAllImportMed = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM import_med");
    return rows;
  } finally {
    connection.release();
  }
};
