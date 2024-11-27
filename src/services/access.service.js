

import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { pool } from '../configs/database.js';

const saltRounds = 10; 

const isnameOrEmailExists = async (name, email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM user WHERE name = ? OR email = ?',
            [name, email]
        );
        return rows.length > 0;
    } finally {
        connection.release();
    }
};

const register = async (userData) => {
    const { name, email } = userData;
    const exists = await isnameOrEmailExists(name, email);
    if (exists) {
        throw new Error('name or Email already existed');
    }

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;
    return await usersModel.createNew(userData);
};

export const accessService = {
    register,
    isnameOrEmailExists,
};
