'use strict';

import { usersModel } from '../models/users.model.js';

const updateUserProfile = async (userId, profileData) => {
    try {
        const affectedRows = await usersModel.updateProfile(userId, profileData);
        return affectedRows;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await usersModel.getById(userId);
        if (user && user.profile_image && !user.profile_image.startsWith('http')) {
            user.profile_image = `${process.env.APP_URL || 'http://localhost:8000'}/${user.profile_image}`;
        }        
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const userProfileService = {
    updateUserProfile,
    getUserProfile,
};

