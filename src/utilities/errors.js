import { HTTP_STATUS_CODE } from "./constants.js";

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS_CODE.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS_CODE.CONFLICT);
  }
}
