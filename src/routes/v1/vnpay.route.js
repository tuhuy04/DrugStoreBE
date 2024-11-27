import express from 'express';
import { handleVnpayCallback } from '../../controllers/vnpay.controller.js';

const router = express.Router();

// Định nghĩa route cho callback
router.get('/vnpay/callback', handleVnpayCallback);

export default router;
