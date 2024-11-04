import jwt from 'jsonwebtoken';
import { env } from '../configs/environment.js';

const authenticateJWT = (req, res, next) => {
  let token = req.headers.authorization;

  // Kiểm tra nếu token có tồn tại
  if (!token) {
    console.error('Token không tồn tại trong request.');
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối.' });
  }

  console.log('Token được nhận:', token);

  // Loại bỏ từ "Bearer " khỏi token nếu có
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  console.log('Token sau khi loại bỏ Bearer:', token);

  // Xác minh token JWT
  jwt.verify(token, env.APP_SECRET, (err, decoded) => {
    if (err) {
      // Xác minh token thất bại, xuất lỗi chi tiết
      console.error('Token không hợp lệ hoặc đã hết hạn:', err.message);
      if (err.name === 'TokenExpiredError') {
        console.error('Token đã hết hạn tại:', err.expiredAt);
        return res.status(403).json({ message: 'Token đã hết hạn.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'JWT không hợp lệ.' });
      }
    } else {
      // Xác minh thành công, hiển thị payload đã giải mã
      console.log('Token hợp lệ. Payload đã giải mã:', decoded);
      req.user = decoded; // Lưu thông tin user vào req
      next(); // Tiếp tục tới middleware hoặc route tiếp theo
    }
  });
};

export default authenticateJWT;
