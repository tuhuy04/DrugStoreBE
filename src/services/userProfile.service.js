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


export const userProfileService = {
    updateUserProfile,
};
