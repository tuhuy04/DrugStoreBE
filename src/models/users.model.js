'use strict';

import { pool } from '../configs/database.js'; 

const createNew = async ({ username, email, password }) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        
        return result.insertId; 
    } finally {
        connection.release();
    }
};

const update = async (id, { username, email, password }) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
            [username, email, password, id]
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
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result.affectedRows; 
    } finally {
        connection.release();
    }
};

const getById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0]; 
    } finally {
        connection.release();
    }
};

const getByEmail = async (email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0]; // Return the first user found
    } finally {
        connection.release();
    }
};

export const usersModel = {
    createNew,
    update,
    deleteById,
    getById,
    getByEmail,  // Add this line
};

