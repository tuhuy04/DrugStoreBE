import Joi from 'joi';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const validateAddToCart = async (req, res, next) => {
    const schema = Joi.object({
        medicineId: Joi.number().required().positive().messages({
            'number.base': 'Medicine ID must be a number',
            'number.positive': 'Medicine ID must be positive',
            'any.required': 'Medicine ID is required'
        }),
        quantity: Joi.number().required().positive().messages({
            'number.base': 'Quantity must be a number',
            'number.positive': 'Quantity must be positive',
            
            'any.required': 'Quantity is required'
        })
    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            error: error.details.map(err => err.message)
        });
    }
};

const validateUpdateQuantity = async (req, res, next) => {
    const schema = Joi.object({
        itemId: Joi.number().required().positive().messages({
            'number.base': 'Item ID must be a number',
            'number.positive': 'Item ID must be positive',
            'any.required': 'Item ID is required'
        }),
        quantity: Joi.number().required().positive().messages({
            'number.base': 'Quantity must be a number',
            'number.positive': 'Quantity must be positive',
            'any.required': 'Quantity is required'
        })
    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            error: error.details.map(err => err.message)
        });
    }
};

export const cartValidation = {
    validateAddToCart,
    validateUpdateQuantity
};