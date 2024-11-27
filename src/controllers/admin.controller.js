import { adminService } from '../services/admin.service.js';


const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
          code: 403,
          status: 'fail',
          error: 'Permission denied'
      });
  }

  try {
      const result = await adminService.updateUserStatus(userId, status);
      if (result.affectedRows === 0) {
          return res.status(404).json({
              code: 404,
              status: 'fail',
              error: 'User not found'
          });
      }

      res.status(200).json({
          code: 200,
          status: 'success',
          data: { message: `User ${status === '0' ? 'blocked' : 'unblocked'} successfully` }
      });
  } catch (error) {
      res.status(500).json({
          code: 500,
          status: 'fail',
          error: 'An error occurred while updating user status'
      });
  }
};

const getUserActivityLogs = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
          code: 403,
          status: 'fail',
          error: 'Permission denied'
      });
  }

  try {
      const logs = await adminService.getUserActivityLogs();
      res.status(200).json({
          code: 200,
          status: 'success',
          data: { logs }
      });
  } catch (error) {
      res.status(500).json({
          code: 500,
          status: 'fail',
          error: 'An error occurred while retrieving activity logs'
      });
  }
};

const createUser = async (req, res) => {
  // Kiểm tra quyền truy cập của admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      code: 403,
      status: 'fail',
      error: 'Permission denied'
    });
  }

  const { name, email, password, phone, address } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({
      code: 400,
      status: 'fail',
      error: 'All fields are required'
    });
  }

  try {
    // Gọi service để tạo người dùng mới
    const userId = await adminService.createUser({ name, email, password, phone, address });
    res.status(201).json({
      code: 201,
      status: 'success',
      data: { message: 'User created successfully', userId }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'fail',
      error: 'Username or Email already existed'
    });
  }
};
const getAllUsers = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
          code: 403,
          status: 'fail',
          error: 'Permission denied'
      });
  }

  try {
      const users = await adminService.getAllUsers();
      res.status(200).json({
          code: 200,
          status: 'success',
          data: users
      });
  } catch (error) {
      res.status(500).json({
          code: 500,
          status: 'fail',
          error: 'An error occurred while retrieving users'
      });
  }
};

export const adminController = { updateUserStatus, getUserActivityLogs, createUser, getAllUsers };
