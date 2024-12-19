// admin.route.js
import express from 'express';
import { adminController } from '../../controllers/admin.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';
import { prescriptionController } from '../../controllers/prescription.controller.js';
import checkAdmin from '../../middlewares/checkAdmin.js';
const router = express.Router();

router.put('/chan-nguoi-dung', authenticateJWT,checkAdmin , adminController.updateUserStatus);
router.get('/hoat-dong-nguoi-dung', authenticateJWT,checkAdmin, adminController.getUserActivityLogs);
// router.post('/tao-moi-nguoi-dung', authenticateJWT,checkAdmin, adminController.createUser);
router.get('/quan-li-tai-khoan', authenticateJWT,checkAdmin, adminController.getAllUsers);
router.post('/quan-li-tai-khoan', authenticateJWT, checkAdmin, adminController.createUser);

router.patch('/:prescriptionId/status', authenticateJWT,checkAdmin, prescriptionController.updatePrescriptionStatus);
router.get('/hoa-don', authenticateJWT,checkAdmin, prescriptionController.getAllPrescriptions);


export const adminRouter = router;
