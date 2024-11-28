import express from "express";
import { env } from "./configs/environment.js";
import { apiV1 } from "./routes/v1/index.js";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cors from 'cors';
import session from 'express-session';
import { getCaptcha, validateCaptcha } from './controllers/captcha.js';


const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'tuantuSjcnejwncjf137728ecf42fc824f',
  resave: false,
  saveUninitialized: true,
}));

// Sử dụng các route cho CAPTCHA
app.get('/captcha', getCaptcha);
app.post('/validate-captcha', validateCaptcha);

app.use('/uploads', express.static('uploads'));

// Routes khác
app.use("/v1", apiV1);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : {}
  });
});

// Start server
app.listen(env.APP_PORT, env.APP_HOST, () => {
  console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
});
