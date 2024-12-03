import express from 'express';
import { accessController } from '../../controllers/access.controller.js';
import { usersValidation } from '../../validations/users.validation.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';
const { validateCreateUser } = usersValidation;
const router = express.Router();

// API đăng ký
router.route('/register').post(validateCreateUser, accessController.register);

// API đăng nhập
// router.route('/login').post((req, res, next) => {
    
//     if (req.session.isCaptchaValid) {
//         accessController.login(req, res, next);
//     } else {
//         res.status(400).json({ message: 'CAPTCHA chưa được xác minh hoặc không hợp lệ.' });
//     }
// });

// Gửi cả access token và refresh token
router.route('/login').post(accessController.login);

router.route('/logout').post(authenticateJWT, accessController.logout);

export const accessRouter = router;
