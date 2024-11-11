'use strict';

import { usersModel } from '../models/users.model.js';
import { emailService } from '../services/email.service.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const logUserActivity = async (userId, activityType) => {
    try {
        await usersModel.logUserActivity(userId, activityType);
    } catch (error) {
        console.error('Lỗi khi ghi lại log hoạt động:', error);
        throw new Error('Không thể ghi log hoạt động');
    }
};

const generateAndSendResetCode = async (email) => {
    const user = await usersModel.getByEmail(email);
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống');
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60000); 

    await usersModel.saveResetCode(user.id, resetCode, resetCodeExpiry);

    const emailContent = `
        <h2>Yêu cầu đặt lại mật khẩu</h2>
        <p>Mã xác nhận của bạn là: <strong>${resetCode}</strong></p>
        <p>Mã này sẽ hết hạn sau 15p </p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `;

    await emailService.sendEmail(
        email,
        'Mã xác nhận đặt lại mật khẩu',
        emailContent
    );
};

const resetPassword = async (email, resetCode, oldPassword, newPassword) => {
   
    const user = await usersModel.getByEmail(email);
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống');
    }

   
    if (user.email !== email) {
        throw new Error('Email không khớp với tài khoản trong hệ thống');
    }

    const isValidCode = await usersModel.verifyResetCode(user.id, resetCode);
    if (!isValidCode) {
        throw new Error('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw new Error('Mật khẩu cũ không chính xác');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await usersModel.updatePassword(user.id, hashedPassword);
    await usersModel.clearResetCode(user.id);
    await logUserActivity(user.id, 'PASSWORD_CHANGE');
};


export const userPasswordService = {
    generateAndSendResetCode,
    resetPassword
};