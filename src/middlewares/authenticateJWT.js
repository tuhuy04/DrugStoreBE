import jwt from "jsonwebtoken";
import { env } from "../configs/environment.js";
import { usersModel } from "../models/users.model.js";

const authenticateJWT = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied." });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, env.APP_SECRET);

    // Kiểm tra người dùng trong database
    const user = await usersModel.getById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status === 0) {
      return res.status(403).json({ message: "Account is blocked." });
    }

    req.user = {
      userId: decoded.userId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Token hết hạn, yêu cầu đăng nhập lại
      return res.status(401).json({
        message: "Session expired, please log in again.",
        requireLogin: true,
      });
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};

export default authenticateJWT;
