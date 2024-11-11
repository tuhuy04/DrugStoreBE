import { cartService } from '../services/cart.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json(cart);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;
        await cartService.addToCart(req.user.userId, medicineId, quantity);
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json(updatedCart);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        await cartService.updateItemQuantity(req.user.userId, itemId, quantity);
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json(updatedCart);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const removeItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await cartService.removeItem(req.user.userId, parseInt(itemId));
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json(updatedCart);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const checkout = async (req, res) => {
    try {
        await cartService.checkout(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json({
            message: 'Checkout successful'
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

export const cartController = {
    getCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    checkout
};