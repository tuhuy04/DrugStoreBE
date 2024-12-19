import express from 'express';
import { cartController } from '../../controllers/cart.controller.js';
import { cartValidation } from '../../validations/cart.validation.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';

const router = express.Router();


router.get('/',authenticateJWT, cartController.getCart);
router.post('/',authenticateJWT, cartValidation.validateAddToCart, cartController.addToCart);
router.put('/', authenticateJWT,cartValidation.validateUpdateQuantity, cartController.updateItemQuantity);
router.delete('/:itemId', authenticateJWT, cartController.removeItem);
router.get('/thanh-toan', authenticateJWT,cartController.checkout);

export const cartRouter = router;