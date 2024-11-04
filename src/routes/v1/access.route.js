import express from 'express';
import { accessController } from '../../controllers/access.controller.js';

const router = express.Router();

router.route('/register').post(accessController.register);

router.route('/login').post(accessController.login);

export const accessRouter = router;
