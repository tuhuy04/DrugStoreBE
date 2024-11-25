import * as dotenv from "dotenv";
dotenv.config(); // Nếu `.env` nằm ngoài thư mục hiện tại


export const env = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,

  //   DB_USER: process.env.DB_USER ,
  //   DB_PASSWORD: process.env.DB_PASSWORD ,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_SECRET: process.env.APP_SECRET,
};

export const VNPAY_CONFIG = {
  tmnCode: process.env.VNP_TMNCODE,
  hashSecret: process.env.VNP_HASHSECRET,
  vnpUrl: process.env.VNP_URL,
  returnUrl: process.env.VNP_RETURN_URL
};
