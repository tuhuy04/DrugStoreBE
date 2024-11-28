import { cartService } from '../services/cart.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: cart
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;
        await cartService.addToCart(req.user.userId, medicineId, quantity);
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: updatedCart
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        await cartService.updateItemQuantity(req.user.userId, itemId, quantity);
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: updatedCart
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const removeItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await cartService.removeItem(req.user.userId, parseInt(itemId));
        const updatedCart = await cartService.getOrCreateCart(req.user.userId);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: updatedCart
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const checkout = async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.ip;
        console.log('Client IP Detected:', clientIp);

        const paymentUrl = await cartService.checkout(req.user.userId, clientIp);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: { paymentUrl }
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
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
