'use strict';

import { accessService } from '../services/access.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';
import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv'; 
import { pool } from '../configs/database.js';

dotenv.config(); 

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Kiểm tra nếu tên hoặc email đã tồn tại
    if (await accessService.isnameOrEmailExists(name, email)) {
      return res.status(409).json({
        code: 409,
        message: 'Name or email already exists',
      });
    }

    // Thêm người dùng mới
    const userId = await accessService.register(req.body);

    res.status(201).json({
      code: 201,
      status: 'success',
      message: 'User registered successfully',
      userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      message: 'An error occurred during registration. Please try again later.',
    });
  }
};



const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await usersModel.getByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 0) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const payload = {
      userId: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status,
    };

    const accessToken = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: '120m',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await usersModel.logUserActivity(user.id, 'login');

    res.status(200).json({
      code: 200,
      status: 'success',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  



const logout = async (req, res) => {
    try {
        const { userId } = req.user;
        await usersModel.logUserActivity(userId, 'logout');
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: { message: 'Logout successful' }
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: 'An error occurred during logout.'
        });
    }
};

export const accessController = {
    register,
    login,
    logout,
};
