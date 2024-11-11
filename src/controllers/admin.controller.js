// controllers/admin.controller.js
import { adminService } from '../services/admin.service.js';

const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Permission denied' });
  }

  // Kiểm tra thông tin người dùng có tồn tại không
  const result = await adminService.updateUserStatus(userId, status);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: `User ${status === '0' ? 'blocked' : 'unblocked'} successfully` });
};

const getUserActivityLogs = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Permission denied' });
  }

  const logs = await adminService.getUserActivityLogs();
  res.json({ logs });
};

export const adminController = { updateUserStatus, getUserActivityLogs };
