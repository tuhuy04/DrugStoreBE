import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../configs/environment.js";

const onlineUsers = {};

const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Đảm bảo cấu hình CORS cho client
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Xác thực user qua token
    socket.on("authenticate", (token) => {
      jwt.verify(token, env.APP_SECRET, (err, user) => {
        if (err) {
          socket.emit("unauthorized", "Invalid token");
          socket.disconnect();
        } else {
          socket.userId = user.userId;
          onlineUsers[user.userId] = socket.id;
          console.log(`User ${user.userId} authenticated`);
        }
      });
    });

    // Nhận và gửi tin nhắn
    socket.on("sendMessage", async ({ toUserId, message }) => {
        const recipientSocketId = onlineUsers[toUserId];
    
        // Lưu tin nhắn vào DB
        await pool.execute(
            'INSERT INTO chat_messages (sender_id, receiver_id, message, is_read) VALUES (?, ?, ?, ?)',
            [socket.userId, toUserId, message, recipientSocketId ? 1 : 0]
        );
    
        // Nếu người nhận online, gửi tin nhắn ngay lập tức
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", {
                from: socket.userId,
                message,
            });
            console.log(`Message sent from ${socket.userId} to ${toUserId}`);
        } else {
            console.log(`User ${toUserId} is not online. Message stored.`);
        }
    });
    // Đánh dấu tin nhắn đã đọc
    socket.on("markMessagesAsRead", async ({ userId, otherUserId }) => {
      try {
        await pool.execute(
          "UPDATE chat_messages SET is_read = 1 WHERE (sender_id = ? AND receiver_id = ?) AND is_read = 0",
          [otherUserId, userId] // Tin nhắn nhận từ otherUserId gửi cho userId
        );
    
        console.log(`Tin nhắn từ ${otherUserId} đến ${userId} đã được đánh dấu là đã đọc.`);
        io.to(onlineUsers[otherUserId]).emit("messagesRead", { userId }); // Gửi sự kiện tới người gửi
      } catch (error) {
        console.error("Lỗi khi đánh dấu tin nhắn là đã đọc:", error.message);
      }
    });
    
    

    // Ngắt kết nối
    socket.on("disconnect", () => {
      delete onlineUsers[socket.userId];
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

export default initSocketServer;
