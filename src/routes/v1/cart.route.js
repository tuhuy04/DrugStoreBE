import express from 'express';
import { cartController } from '../../controllers/cart.controller.js';
import { cartValidation } from '../../validations/cart.validation.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateJWT);

router.get('/', cartController.getCart);
router.post('/them', cartValidation.validateAddToCart, cartController.addToCart);
router.put('/chinh-sua', cartValidation.validateUpdateQuantity, cartController.updateItemQuantity);
router.delete('/item/:itemId', cartController.removeItem);
router.get('/thanh-toan', cartController.checkout);

export const cartRouter = router;