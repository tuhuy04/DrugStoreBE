import Joi from "joi";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().required().trim(),
    category_id: Joi.number().positive().required(),
    supplier_id: Joi.number().positive().required(),
    description: Joi.string().required().trim(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().required().trim(),
    cost_price: Joi.number().positive().required(),
    selling_price: Joi.number().positive().required(),
    image_url: Joi.string().uri().required(),
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: new Error(error.details.map(detail => detail.message).join(", ")).message
    });
  }
};

const update = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().optional().min(3).max(100).trim(), 
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: new Error(error.details.map(detail => detail.message).join(", ")).message
    });
  }
};

export const medicineValidation = {
    createNew,
    update,
  };
