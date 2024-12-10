import { HTTP_STATUS_CODE } from "../utilities/constants.js";

export const sendSuccessResponse = (res, data = {}, statusCode = HTTP_STATUS_CODE.OK) => {
  res.status(statusCode).json({
    code: statusCode,
    status: 'success',
    data
  });
};

export const sendSuccessResponseWithCount = (res, data = {}, statusCode = HTTP_STATUS_CODE.OK) => {
  const { totalRecord, data: rows } = data;

  const response = {
      code: statusCode,
      status: 'success',
      count: totalRecord, 
      data: rows,        
  };

  res.status(statusCode).json(response);
}; 

export const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({
    code: statusCode,
    status: error.status || 'error',
    data: {
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};
  