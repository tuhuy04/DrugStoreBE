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

const getUserActivityLogs = async (page, pageSize, keyword) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const searchKeyword = `%${keyword}%`; // Tìm kiếm với từ khóa

  // Truy vấn logs
  let logsQuery = 'SELECT * FROM user_activity_log';
  let countQuery = 'SELECT COUNT(*) as total FROM user_activity_log'; // Đếm tổng số bản ghi
  let params = [];
  
  if (keyword) {
    const whereClause = ' WHERE activity_type LIKE ? OR user_id LIKE ?';
    logsQuery += whereClause;
    countQuery += whereClause;
    params = [searchKeyword, searchKeyword];
  }

  logsQuery += ' ORDER BY activity_time DESC LIMIT ? OFFSET ?';
  const [logs] = await pool.query(logsQuery, [...params, limit, offset]);
  
  // Truy vấn tổng số bản ghi
  const [totalRows] = await pool.query(countQuery, params);
  const totalRecords = totalRows[0].total;

  return {
    logs,
    totalRecords,
  };
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

const getAllUsers = async (page, pageSize, keyword) => {
  const limit = pageSize; // Số lượng bản ghi mỗi trang
  const offset = (page - 1) * pageSize; // Vị trí bắt đầu
  const searchKeyword = `%${keyword}%`; // Tìm kiếm gần đúng

  // Truy vấn danh sách người dùng
  let usersQuery = 'SELECT id, name, email, phone, address, status FROM user';
  let countQuery = 'SELECT COUNT(*) as total FROM user'; // Truy vấn tổng số bản ghi
  let params = [];

  if (keyword) {
    const whereClause = ' WHERE name LIKE ? OR email LIKE ?';
    usersQuery += whereClause;
    countQuery += whereClause;
    params = [searchKeyword, searchKeyword];
  }

  usersQuery += ' ORDER BY name ASC LIMIT ? OFFSET ?';
  const [users] = await pool.query(usersQuery, [...params, limit, offset]);

  // Truy vấn tổng số bản ghi
  const [totalRows] = await pool.query(countQuery, params);
  const totalRecords = totalRows[0].total;

  return {
    users,
    totalRecords,
  };
};



export const adminService = { 
  updateUserStatus, 
  getUserActivityLogs, 
  createUser, 
  getAllUsers 
};

