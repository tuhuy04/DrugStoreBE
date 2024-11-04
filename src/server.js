import express from "express";
import { env } from "./configs/environment.js"; // Cấu hình environment
import { apiV1 } from "./routes/v1/index.js"; // Routes v1
import helmet from "helmet"; // Bảo mật
import morgan from "morgan"; // Log requests
import compression from "compression"; // Nén requests
import { pool } from './configs/database.js';  // Kết nối DB
import cors from 'cors';

const app = express();

// Middleware
app.use(cors()); 
app.use(morgan('dev')); // Log HTTP
app.use(helmet()); // Bảo mật
app.use(compression()); // Nén request
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Kết nối Database

// Routes
app.use("/v1", apiV1); // Sử dụng routes v1

// Xử lý lỗi 404
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Xử lý các lỗi khác
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : {}
  });
});

// Khởi động server
app.listen(env.APP_PORT, env.APP_HOST, () => {
  console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
});
