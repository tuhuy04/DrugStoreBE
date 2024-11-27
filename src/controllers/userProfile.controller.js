'use strict';

import { userProfileService } from '../services/userProfile.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { phone, date_of_birth, address, gender } = req.body;

    // Kiểm tra nếu có ảnh được upload
    const profile_image = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const profileData = { phone, date_of_birth, profile_image, address, gender };

    try {
        const affectedRows = await userProfileService.updateUserProfile(userId, profileData);
        if (affectedRows === 0) {
            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                code: HTTP_STATUS_CODE.NOT_FOUND,
                status: 'fail',
                message: 'Người dùng không tồn tại hoặc không có thay đổi',
            });
        }

        // Lấy dữ liệu người dùng sau khi cập nhật
        const updatedUser = await userProfileService.getUserProfile(userId);

        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: 'Cập nhật hồ sơ thành công',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.',
        });
    }
};

const getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const userProfile = await userProfileService.getUserProfile(userId);

        if (!userProfile) {
            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                code: HTTP_STATUS_CODE.NOT_FOUND,
                status: 'fail',
                message: 'Người dùng không tồn tại.',
            });
        }

        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: userProfile,
        });
    } catch (error) {
        console.error('Lỗi lấy hồ sơ người dùng:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra khi lấy hồ sơ người dùng.',
        });
    }
};


export const userProfileController = {
    updateProfile,
    getProfile,
};
