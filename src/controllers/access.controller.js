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
        const userId = await accessService.register(req.body);
        res.status(HTTP_STATUS_CODE.CREATED).send({ message: 'User registered successfully', userId });
    } catch (error) {
        if (error.message === 'name or Email already existed') {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
                error: error.message,
            });
        }
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: new Error(error).message,
        });
    }
};

const login = async (req, res, next ) => {
    const { identifier, password } = req.body;

    try {
        const user = await usersModel.getByEmailOrUsername(identifier);
        // Check the actual type and value
        if (!user) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'User not found' });
        }

        if (user.status === 0) {
            return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({ message: 'Account is blocked' });
        }
                        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid password' });
        }

        const secret = process.env.APP_SECRET || 'defaultSecretKey';
        const token = jwt.sign(
            { userId: user.id, name: user.name, role: user.role, status: user.status },
            secret,
            { expiresIn: '2h' }
        );

        // Use usersModel to log user activity
        await usersModel.logUserActivity(user.id, 'login');

        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message || 'An error occurred during login.'
        });
    }
};



const logout = async (req, res) => {
    try {
        const { userId } = req.user;

        await usersModel.logUserActivity(userId, 'logout');

        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred during logout.'
        });
    }
};

export const accessController = {
    register,
    login,
    logout,
};
