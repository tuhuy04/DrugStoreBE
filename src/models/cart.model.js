import { pool } from '../configs/database.js';

const createCart = async (userId) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'INSERT INTO cart (user_id, status) VALUES (?, ?)',
            [userId, 'active']
        );
        return result.insertId;
    } finally {
        connection.release();
    }
};
// 
const getActiveCart = async (userId) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT c.*, ci.id as item_id, ci.medicine_id, ci.quantity, 
             m.name as medicine_name, m.selling_price, m.image_url,
             (ci.quantity * m.selling_price) as item_total
             FROM cart c
             LEFT JOIN cart_item ci ON c.id = ci.cart_id
             LEFT JOIN medicine m ON ci.medicine_id = m.id
             WHERE c.user_id = ? AND c.status = 'active'`,
            [userId]
        );
        
        if (rows.length === 0) {
            return null;
        }

        // Tạo đối tượng giỏ hàng và thêm tổng tiền cho từng mặt hàng và tổng giỏ hàng
        const cart = {
            id: rows[0].id,
            userId: rows[0].user_id,
            status: rows[0].status,
            items: rows.map(row => ({
                id: row.item_id,
                medicineId: row.medicine_id,
                medicineName: row.medicine_name,
                quantity: row.quantity,
                price: row.selling_price,
                imageUrl: row.image_url,
                itemTotal: row.item_total // Tổng tiền của từng sản phẩm
            })).filter(item => item.id !== null),
            cartTotal: rows.reduce((total, row) => total + (row.item_total || 0), 0) // Tổng tiền của giỏ hàng
        };

        return cart;
    } finally {
        connection.release();
    }
};  


const updateCartStatus = async (cartId, status) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE cart SET status = ? WHERE id = ?',
            [status, cartId]
        );
        return result.affectedRows;
    } finally {
        connection.release();
    }
};

const getPurchasedCart = async (userId) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT c.*, ci.id as item_id, ci.medicine_id, ci.quantity, 
             m.name as medicine_name, m.selling_price, m.image_url,
             (ci.quantity * m.selling_price) as item_total
             FROM cart c
             LEFT JOIN cart_item ci ON c.id = ci.cart_id
             LEFT JOIN medicine m ON ci.medicine_id = m.id
             WHERE c.user_id = ? AND c.status = 'purchased'`,
            [userId]
        );
        
        if (rows.length === 0) {
            return null;
        }

        // Tạo đối tượng giỏ hàng và thêm tổng tiền cho từng mặt hàng và tổng giỏ hàng
        const cart = {
            id: rows[0].id,
            userId: rows[0].user_id,
            status: rows[0].status,
            items: rows.map(row => ({
                id: row.item_id,
                medicineId: row.medicine_id,
                medicineName: row.medicine_name,
                quantity: row.quantity,
                price: row.selling_price,
                imageUrl: row.image_url,
                itemTotal: row.item_total // Tổng tiền của từng sản phẩm
            })).filter(item => item.id !== null),
            cartTotal: rows.reduce((total, row) => total + (row.item_total || 0), 0) // Tổng tiền của giỏ hàng
        };

        return cart;
    } finally {
        connection.release();
    }
};


export const cartModel = {
    createCart,
    getActiveCart,
    updateCartStatus,
    getPurchasedCart
};