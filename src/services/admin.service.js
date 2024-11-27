// services/admin.service.js
import { usersModel } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { pool } from '../configs/database.js';
import {accessService} from './access.service.js';

const saltRounds = 10; 

const updateUserStatus = async (userId, status) => {
  const result = await usersModel.updateUserStatus(userId, status);
  return result;
};

const getUserActivityLogs = async () => {
  const logs = await usersModel.getUserActivityLogs();
  return logs;
};

const createUser = async (userData) => {
  const { name, email } = userData;
  const exists = await accessService.isnameOrEmailExists(name, email);
    if (exists) {
        throw new Error('name or Email already existed');
    }
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;
    return await usersModel.createNew(userData);
};

const getAllUsers = async () => {
  const users = await usersModel.getAllUsers();
  return users;
};

export const adminService = { 
  updateUserStatus, 
  getUserActivityLogs, 
  createUser, 
  getAllUsers 
};

