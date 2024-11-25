import express from 'express';
import { cartController } from '../../controllers/cart.controller.js';
import { cartValidation } from '../../validations/cart.validation.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateJWT);

router.get('/', cartController.getCart);
router.post('/add', cartValidation.validateAddToCart, cartController.addToCart);
router.put('/update', cartValidation.validateUpdateQuantity, cartController.updateItemQuantity);
router.delete('/item/:itemId', cartController.removeItem);
router.get('/checkout', cartController.checkout);

export const cartRouter = router;