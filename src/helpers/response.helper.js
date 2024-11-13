import { HTTP_STATUS_CODE } from "../utilities/constants.js";
  
const sendSuccessResponse = (res, data = {}) => {
    res.status(HTTP_STATUS_CODE.OK).send({
      code: HTTP_STATUS_CODE.OK,
      status: "success",
      data
    });
  };
  
const sendErrorResponse = (res, error) => {
    let statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  
    if (error.name === "ValidationError") {
      statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    } else if (error.name === "UnauthorizedError") {
      statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
    } else if (error.name === "ForbiddenError") {
      statusCode = HTTP_STATUS_CODE.FORBIDDEN;
    } else if (error.name === "NotFoundError") {
      statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    }
  
    res.status(statusCode).send({
      code: statusCode,
      status: "fail",
      data: { error: error.message || "An error occurred" }
    });
  };

  export { sendSuccessResponse, sendErrorResponse };
  