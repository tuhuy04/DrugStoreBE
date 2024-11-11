// apiV1.routes.js
import express from 'express';
import { boardsRouter } from './boards.route.js';
import { accessRouter } from './access.route.js';
import { userProfileRouter } from './userProfile.route.js';
import {userPasswordRouter } from './userPassword.route.js'
import {adminRouter} from './admin.route.js'
import { cartRouter } from './cart.route.js';

const router = express.Router();

// Định nghĩa route cho các module khác nhau
router.use('/boards', boardsRouter);
router.use('/auth', accessRouter);
router.use('/user', userProfileRouter); 
router.use('/password', userPasswordRouter);
router.use('/admin', adminRouter);
router.use('/cart', cartRouter);

export const apiV1 = router;
