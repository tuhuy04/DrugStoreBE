// services/admin.service.js
import { usersModel } from '../models/users.model.js';

const updateUserStatus = async (userId, status) => {
  const result = await usersModel.updateUserStatus(userId, status);
  return result;
};

const getUserActivityLogs = async () => {
  const logs = await usersModel.getUserActivityLogs();
  return logs;
};

export const adminService = { updateUserStatus, getUserActivityLogs };
