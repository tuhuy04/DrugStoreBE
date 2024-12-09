import { adminService } from '../services/admin.service.js';


const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

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
  try {
    // Đặt giá trị mặc định cho page và pageSize
    let { page = 1, pageSize = 10, keyword = '' } = req.query;

   
    page = Math.max(1, Number(page)); // Ít nhất là 1
    pageSize = Math.max(1, Number(pageSize)); // Ít nhất là 1

    const { logs, totalRecords } = await adminService.getUserActivityLogs(page, pageSize, keyword); // Gọi service

    const totalPages = Math.ceil(totalRecords / pageSize); // Tính tổng số trang

    res.status(200).json({
      code: 200,
      status: 'success',
      data: {
        logs,
        page,
        pageSize,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'fail',
      error: 'An error occurred while retrieving activity logs',
    });
  }
};



const createUser = async (req, res) => {

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
  try {
    // Lấy giá trị page, pageSize và keyword từ query, đặt giá trị mặc định
    let { page = 1, pageSize = 10, keyword = '' } = req.query;

    page = Math.max(1, Number(page)); // Ít nhất là 1
    pageSize = Math.max(1, Number(pageSize)); // Ít nhất là 1

    // Gọi service để lấy dữ liệu
    const { users, totalRecords } = await adminService.getAllUsers(page, pageSize, keyword);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      code: 200,
      status: 'success',
      data: {
        users,
        page,
        pageSize,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'fail',
      error: 'An error occurred while retrieving users',
    });
  }
};



export const adminController = { updateUserStatus, getUserActivityLogs, createUser, getAllUsers };
