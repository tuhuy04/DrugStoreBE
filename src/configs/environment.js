import * as dotenv from "dotenv";
dotenv.config(); // Nếu `.env` nằm ngoài thư mục hiện tại

console.log("APP_PORT: ", process.env.APP_PORT);
console.log("APP_HOST: ", process.env.APP_HOST);
// In ra giá trị APP_PORT

export const env = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,

  //   DB_USER: process.env.DB_USER ,
  //   DB_PASSWORD: process.env.DB_PASSWORD ,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_SECRET: process.env.APP_SECRET,
};
