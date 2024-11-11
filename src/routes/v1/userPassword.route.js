import express from 'express';
import { userPasswordController } from '../../controllers/userPassword.controller.js';
import { usersValidation } from '../../validations/users.validation.js';
import authenticateJWT  from '../../middlewares/authenticateJWT.js';
const router = express.Router();

router.post('/request-change', authenticateJWT, usersValidation.validatePasswordResetRequest, userPasswordController.requestPasswordReset);
router.post('/change-password',authenticateJWT, usersValidation.validatePasswordReset, userPasswordController.resetPassword);

export const userPasswordRouter = router;