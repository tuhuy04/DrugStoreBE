'use strict';

import { accessService } from '../services/access.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';
import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv'; 

dotenv.config(); 

const register = async (req, res) => {
    try {
        const userId = await accessService.register(req.body);
        res.status(HTTP_STATUS_CODE.CREATED).send({ message: 'User registered successfully', userId });
    } catch (error) {
        if (error.message === 'Username or Email already existed') {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
                error: error.message,
            });
        }
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: new Error(error).message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //email
        const user = await usersModel.getByEmail(email);
        if (!user) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'User not found' });
        }

        // Compare pass
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid password' });
        }

        // Check key
        const secret = process.env.APP_SECRET || 'defaultSecretKey';
        if (!secret) {
            throw new Error('APP_SECRET is not defined');
        }

        // Gen token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            secret,
            { expiresIn: '1h' }
        );

    
        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
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

export const accessController = {
    register,
    login,
};
