'use strict';

import { userProfileService } from '../services/userProfile.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { phone, date_of_birth, address, gender } = req.body;

    // Check if a profile image was uploaded
    const profile_image = req.file ? req.file.path : null;

    const profileData = { phone, date_of_birth, profile_image, address, gender };

    try {
        const affectedRows = await userProfileService.updateUserProfile(userId, profileData);
        if (affectedRows === 0) {
            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
                code: HTTP_STATUS_CODE.NOT_FOUND,
                status: 'fail',
                message: 'Người dùng không tồn tại hoặc không có thay đổi'
            });
        }
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: 'Cập nhật hồ sơ thành công'
        });
    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            message: error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.'
        });
    }
};

export const userProfileController = {
    updateProfile,
};
