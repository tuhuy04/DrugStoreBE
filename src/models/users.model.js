'use strict';

import { pool } from '../configs/database.js'; 

const createNew = async ({ name, email, password, phone, address }) => {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO user (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, phone, address]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  };
  

const update = async (id, { name, email, password }) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, id]
        );
        return result.affectedRows; 
    } finally {
        connection.release();
    }
};

const deleteById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'DELETE FROM user WHERE id = ?',
            [id]
        );
        return result.affectedRows; 
    } finally {
        connection.release();
    }
};


const getByEmail = async (email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );
        return rows[0]; // Return the first user found
    } finally {
        connection.release();
    }
};

const getByEmailOrUsername = async (identifier) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM user WHERE email = ? OR name = ?',
            [identifier, identifier]
        );
        return rows[0]; // Return the first user found
    } finally {
        connection.release();
    }
};

const updateProfile = async (id, profileData) => {
    const connection = await pool.getConnection();
    try {
        // Lọc ra các trường cần cập nhật
        const fields = [];
        const values = [];

        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            throw new Error('Không có thông tin nào để cập nhật.');
        }

        // Thêm id vào cuối mảng values
        values.push(id);

        // Tạo câu truy vấn động
        const query = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await connection.execute(query, values);
        return result.affectedRows; // Return number of affected rows
    } finally {
        connection.release();
    }
};

const saveResetCode = async (userId, resetCode, resetCodeExpiry) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'UPDATE user SET reset_code = ?, reset_code_expiry = ? WHERE id = ?',
            [resetCode, resetCodeExpiry, userId]
        );
    } finally {
        connection.release();
    }
};

const verifyResetCode = async (userId, resetCode) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT reset_code, reset_code_expiry FROM user WHERE id = ? AND reset_code = ? AND reset_code_expiry > NOW()',
            [userId, resetCode]
        );
        return rows.length > 0;
    } finally {
        connection.release();
    }
};

const updatePassword = async (userId, hashedPassword) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'UPDATE user SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
    } finally {
        connection.release();
    }
};

const clearResetCode = async (userId) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'UPDATE user SET reset_code = NULL, reset_code_expiry = NULL WHERE id = ?',
            [userId]
        );
    } finally {
        connection.release();
    }
};

// Function to block/unblock user
const updateUserStatus = async (userId, status) => {
    const [result] = await pool.query('UPDATE user SET status = ? WHERE id = ?', [status, userId]);
    return result;
  };
  
  // Function to get user activity logs
  const getUserActivityLogs = async (limit, offset) => {
    const [logs] = await pool.query(
      'SELECT * FROM user_activity_log ORDER BY activity_time DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return logs;
  };
  
  const logUserActivity = async (userId, activityType) => {
    await pool.query('INSERT INTO user_activity_log (user_id, activity_type) VALUES (?, ?)', [userId, activityType]);
  };    


  const getAllUsers = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, address, status FROM user'
        );
        return rows;
    } finally {
        connection.release();
    }
};

const getById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, date_of_birth, profile_image, address, gender,role FROM user WHERE id = ?',
            [id]
        );
        return rows[0];
    } finally {
        connection.release();
    }
};


export const usersModel = {
    createNew,
    update,
    deleteById,
    getById,
    getByEmail,
    getByEmailOrUsername,
    updateProfile,
    saveResetCode,
    verifyResetCode,
    updatePassword,
    clearResetCode,
    updateUserStatus,
    getUserActivityLogs,
    logUserActivity,
    getAllUsers
};



