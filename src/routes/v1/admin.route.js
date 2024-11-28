// admin.route.js
import express from 'express';
import { adminController } from '../../controllers/admin.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';
import { prescriptionController } from '../../controllers/prescription.controller.js';
const router = express.Router();

router.put('/block-user', authenticateJWT, adminController.updateUserStatus);
router.get('/user-activity-logs', authenticateJWT, adminController.getUserActivityLogs);
router.post('/create-user', authenticateJWT, adminController.createUser);
router.get('/users', authenticateJWT, adminController.getAllUsers);


router.patch('/:prescriptionId/status', authenticateJWT, prescriptionController.updatePrescriptionStatus);
router.get('/prescriptions', authenticateJWT, prescriptionController.getAllPrescriptions);


export const adminRouter = router;
