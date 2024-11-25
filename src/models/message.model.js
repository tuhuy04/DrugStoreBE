import { pool } from "../configs/database.js";

// Hàm lưu tin nhắn
const saveMessage = async (senderId, receiverId, content) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO chat_messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, NOW())",
      [senderId, receiverId, content]
    );
    // Thêm log
    console.log("Tham số truyền vào:", { senderId, receiverId, content });
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Hàm lấy tin nhắn giữa 2 người dùng
const getMessages = async (userId, otherUserId) => {
  const connection = await pool.getConnection();
  try {
    console.log("Tham số truyền vào SQL:", { userId, otherUserId });
    const [messages] = await connection.execute(
      `SELECT id, sender_id, receiver_id, message, is_read, timestamp
       FROM chat_messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY timestamp ASC`,
      [userId, otherUserId, otherUserId, userId]
    );
    return messages;
  } finally {
    connection.release();
  }
};


// Hàm lấy lịch sử trò chuyện
const getChatHistory = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [chatHistory] = await connection.execute(
      "SELECT * FROM chat_messages WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp DESC",
      [userId, userId]
    );
    return chatHistory;
  } finally {
    connection.release();
  }
};
const markMessagesAsRead = async (userId, otherUserId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `UPDATE chat_messages 
       SET is_read = 1 
       WHERE receiver_id = ? AND sender_id = ? AND is_read = 0`,
      [userId, otherUserId]
    );
    console.log("Số tin nhắn được đánh dấu đã đọc:", result.affectedRows);
    return result.affectedRows > 0; // Trả về true nếu có bản ghi được cập nhật
  } finally {
    connection.release();
  }
};

export const messageModel = {
  saveMessage,
  getMessages,
  getChatHistory,
  markMessagesAsRead, 
};
