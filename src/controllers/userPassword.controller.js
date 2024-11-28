'use strict';

import { userPasswordService } from '../services/userPassword.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';
import { usersModel } from '../models/users.model.js';

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const  userEmail  = req.user.email
    console.log(req.user);
    if (email !== userEmail) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            code: HTTP_STATUS_CODE.FORBIDDEN,
            status: 'fail',
            message: 'Bạn chỉ có thể yêu cầu đặt lại mật khẩu cho email của mình'
        });
    }

    try {
        await userPasswordService.generateAndSendResetCode(email);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: 'Mã xác nhận đã được gửi đến email của bạn'
        });
    } catch (error) {
        console.error('Lỗi khi gửi mã xác nhận:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra khi gửi mã xác nhận'
        });
    }
};


const resetPassword = async (req, res) => {
    const { email, resetCode, oldPassword, newPassword } = req.body;
    const { userId } = req.user;

    if (!userId) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            message: 'User ID is missing'
        });
    }

    try {
        await userPasswordService.resetPassword(email, resetCode, oldPassword, newPassword);
        await usersModel.logUserActivity(userId, 'PASSWORD_CHANGE');
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: 'Mật khẩu đã được thay đổi thành công'
        });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu'
        });
    }
};

export const userPasswordController = {
    requestPasswordReset,
    resetPassword
};
