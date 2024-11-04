

import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { pool } from '../configs/database.js';

const saltRounds = 10; 

const isUsernameOrEmailExists = async (username, email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        return rows.length > 0;
    } finally {
        connection.release();
    }
};

const register = async (userData) => {
    const { username, email } = userData;
    const exists = await isUsernameOrEmailExists(username, email);
    if (exists) {
        throw new Error('Username or Email already existed');
    }

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;
    return await usersModel.createNew(userData);
};

export const accessService = {
    register,
};
