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
        console.error('Error getting cart:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message || 'An error occurred while retrieving the cart.'
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
        console.error('Error adding item to cart:', error);
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            error: error.message || 'An error occurred while adding item to the cart.'
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
        // Trả lỗi chi tiết cho người dùng
        if (error.message.includes("Not enough stock available")) {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                code: HTTP_STATUS_CODE.BAD_REQUEST,
                status: 'fail',
                error: "Không đủ số lượng trong kho"
            });
        }

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
        console.error('Error removing item from cart:', error);
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: HTTP_STATUS_CODE.BAD_REQUEST,
            status: 'fail',
            error: error.message || 'An error occurred while removing item from the cart.'
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
        console.error('Error during checkout:', error);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message || 'An error occurred during checkout.'
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
