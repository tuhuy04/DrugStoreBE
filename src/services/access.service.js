

import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { pool } from '../configs/database.js';

const saltRounds = 10; 

const isnameOrEmailExists = async (name, email) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT 1 FROM user WHERE name = ? OR email = ?',
        [name, email]
      );
      return rows.length > 0;
    } finally {
      connection.release();
    }
  };
  
  const register = async (userData) => {
    const { name, email, password, phone, address } = userData;
  
    // Kiểm tra tồn tại
    if (await isnameOrEmailExists(name, email)) {
      throw new Error('Name or Email already exists');
    }
  
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Tạo người dùng mới
    return await usersModel.createNew({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });
  };

export const accessService = {
    register,
    isnameOrEmailExists,
};
