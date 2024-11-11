// admin.route.js
import express from 'express';
import { adminController } from '../../controllers/admin.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';

const router = express.Router();

router.put('/block-user', authenticateJWT, adminController.updateUserStatus);
router.get('/user-activity-logs', authenticateJWT, adminController.getUserActivityLogs);

export const adminRouter = router;
