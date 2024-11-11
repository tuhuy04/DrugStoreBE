import Joi from "joi";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().required().min(3).max(100).trim()
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: new Error(error).message
    });
  }
};

export const boardsValidation = {
  createNew,
};
