import express from 'express';
import { userPasswordController } from '../../controllers/userPassword.controller.js';
import { usersValidation } from '../../validations/users.validation.js';
import authenticateJWT  from '../../middlewares/authenticateJWT.js';
const router = express.Router();

router.post('/yeu-cau-thay-doi', authenticateJWT, usersValidation.validatePasswordResetRequest, userPasswordController.requestPasswordReset);
router.post('/thay-doi-mat-khau',authenticateJWT, usersValidation.validatePasswordReset, userPasswordController.resetPassword);

export const userPasswordRouter = router;