import Joi from 'joi';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

// Existing validateCreateUser function

const validateCreateUser = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().messages({
      'string.base': 'Name should be a type of text.',
      'string.empty': 'Name cannot be empty.',
      'string.min': 'Name should have at least 3 characters.',
      'string.max': 'Name should have at most 50 characters.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().trim().messages({
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Password should have at least 6 characters.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.',
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().trim().messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits.',
    }),
    address: Joi.string().max(100).optional().trim().messages({
      'string.max': 'Address should have at most 100 characters.',
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: error.details.map(err => err.message),
    });
  }
};

const validateUpdateProfile = async (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().trim().messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits.',
    }),
    date_of_birth: Joi.date().iso().optional().messages({
      'date.base': 'Date of birth must be a valid date.',
      'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD).',
    }),
    profile_image: Joi.string().uri().optional().trim().messages({
      'string.uri': 'Profile image must be a valid URL.',
    }),
    address: Joi.string().max(100).optional().trim().messages({
      'string.max': 'Address should have at most 100 characters.',
    }),
    gender: Joi.string().valid('male', 'female', 'other').optional().messages({
      'any.only': 'Gender must be either male, female, or other.',
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: error.details.map(err => err.message),
    });
  }
};

const validatePasswordResetRequest = async (req, res, next) => {
  const schema = Joi.object({
      email: Joi.string().email().required().trim().messages({
          'string.email': 'Email phải là địa chỉ email hợp lệ',
          'string.empty': 'Email không được để trống',
          'any.required': 'Email là bắt buộc',
      })
  });

  try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
  } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          error: error.details.map(err => err.message),
      });
  }
};

const validatePasswordReset = async (req, res, next) => {
  const schema = Joi.object({
      email: Joi.string().email().required().trim().messages({
          'string.email': 'Email phải là địa chỉ email hợp lệ',
          'string.empty': 'Email không được để trống',
          'any.required': 'Email là bắt buộc',
      }),
      resetCode: Joi.string().length(6).required().messages({
          'string.length': 'Mã xác nhận phải có 6 ký tự',
          'string.empty': 'Mã xác nhận không được để trống',
          'any.required': 'Mã xác nhận là bắt buộc',
      }),
      oldPassword: Joi.string().min(1).required().messages({
        'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
        'string.empty': 'Mật khẩu mới không được để trống',
        'any.required': 'Mật khẩu mới là bắt buộc',
    }),
      newPassword: Joi.string().min(6).required().messages({
          'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
          'string.empty': 'Mật khẩu mới không được để trống',
          'any.required': 'Mật khẩu mới là bắt buộc',
      })
  });

  try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
  } catch (error) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          error: error.details.map(err => err.message),
      });
  }
};


// Export both functions properly
export const usersValidation = {
  validateCreateUser,
  validateUpdateProfile,
  validatePasswordResetRequest,
  validatePasswordReset
};
