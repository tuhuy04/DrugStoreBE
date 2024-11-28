import { messageModel } from "../models/message.model.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { pool } from "../configs/database.js";
const saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({
        code: 400,
        status: "fail",
        error: "Thiếu tham số bắt buộc: senderId, receiverId hoặc content.",
      });
    }

    const messageId = await messageModel.saveMessage(senderId, receiverId, content);

    // Truy vấn timestamp của tin nhắn vừa tạo
    const [message] = await pool.execute(
      "SELECT timestamp FROM chat_messages WHERE id = ?",
      [messageId]
    );

    res.status(HTTP_STATUS_CODE.CREATED).json({
      code: HTTP_STATUS_CODE.CREATED,
      status: "success",
      data: {
        messageId,
        senderId,
        receiverId,
        content,
        timestamp: message[0].timestamp, // Trả về timestamp
      },
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      status: "fail",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy userId từ JWT
    const { otherUserId } = req.query;

    if (!otherUserId) {
      return res.status(400).json({
        code: 400,
        status: "fail",
        error: "Thiếu tham số bắt buộc: otherUserId.",
      });
    }

    // Đánh dấu tin nhắn nhận được từ người kia là đã đọc
    await messageModel.markMessagesAsRead(userId, otherUserId);

    // Lấy lại tin nhắn sau khi đánh dấu là đã đọc
    const messages = await messageModel.getMessages(userId, otherUserId);

    res.status(HTTP_STATUS_CODE.OK).json({
      code: HTTP_STATUS_CODE.OK,
      status: "success",
      data: messages.map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.message,
        isRead: msg.is_read, // Đảm bảo gửi trạng thái is_read
        timestamp: msg.timestamp,
      })),
    });
    
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      status: "fail",
      error: error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatHistory = await messageModel.getChatHistory(userId);
    res.status(HTTP_STATUS_CODE.OK).json({
      code: HTTP_STATUS_CODE.OK,
      status: "success",
      data: chatHistory,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      status: "fail",
      error: error.message,
    });
  }
};


export const chatController = {
  saveMessage,
  getMessages,
  getChatHistory,
};

