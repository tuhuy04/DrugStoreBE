import { pool } from '../configs/database.js';
import { cartModel } from './cart.model.js';

const createPrescription = async (userId, cardId) => {
    const connection = await pool.getConnection();

    try {
        // Lấy giỏ hàng đang hoạt động và tổng tiền
        const cart = await cartModel.getPurchasedCart(userId);
        console.log(cart);
        if (!cart) {
            throw new Error('No purchased cart found for this user');
        }
        const [result] = await connection.execute(
            `INSERT INTO prescription (user_id, cart_id, total_money, status, created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [userId, cardId, cart.cartTotal, 'pending']
            
        );
        console.log("Result",result);
     
        const prescriptionId = result.insertId;

        await connection.commit();

        return { prescriptionId, totalMoney: cart.cartTotal };
    } catch (error) {
        // Rollback nếu có lỗi
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Hàm để lấy prescription theo ID
const getPrescriptionById = async (prescriptionId) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT * FROM prescription WHERE id = ?`,
            [prescriptionId]
        );
        return rows[0];
    } finally {
        connection.release();
    }
};

// Hàm cập nhật trạng thái prescription
const updatePrescriptionStatus = async (prescriptionId, status) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE prescription SET status = ? WHERE id = ?',
            [status, prescriptionId]
        );
        return result.affectedRows;
    } finally {
        connection.release();
    }
};
const getAllPrescriptions = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            `SELECT * FROM prescription`
        );
        return rows;
    } finally {
        connection.release();
    }
};


export const prescriptionModel = {
    createPrescription,
    getPrescriptionById,
    updatePrescriptionStatus,
    getAllPrescriptions
};
