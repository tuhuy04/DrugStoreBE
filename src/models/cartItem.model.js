import { pool } from '../configs/database.js';

const addItem = async (cartId, medicineId, quantity) => {
    const connection = await pool.getConnection();
    try {
        // Check if item already exists in cart
        const [existing] = await connection.execute(
            'SELECT * FROM cart_item WHERE cart_id = ? AND medicine_id = ?',
            [cartId, medicineId]
        );

        if (existing.length > 0) {
            // Update quantity if item exists
            const [result] = await connection.execute(
                'UPDATE cart_item SET quantity = quantity + ? WHERE cart_id = ? AND medicine_id = ?',
                [quantity, cartId, medicineId]
            );
            return result.affectedRows;
        } else {
            // Add new item if it doesn't exist
            const [result] = await connection.execute(
                'INSERT INTO cart_item (cart_id, medicine_id, quantity) VALUES (?, ?, ?)',
                [cartId, medicineId, quantity]
            );
            return result.insertId;
        }
    } finally {
        connection.release();
    }
};

const updateItemQuantity = async (itemId, quantity) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE cart_item SET quantity = ? WHERE id = ?',
            [quantity, itemId]
        );
        return result.affectedRows;
    } finally {
        connection.release();
    }
};

const removeItem = async (itemId) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'DELETE FROM cart_item WHERE id = ?',
            [itemId]
        );
        return result.affectedRows;
    } finally {
        connection.release();
    }
};

export const cartItemModel = {
    addItem,
    updateItemQuantity,
    removeItem
};