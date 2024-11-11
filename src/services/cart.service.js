import { cartModel } from '../models/cart.model.js';
import { cartItemModel } from '../models/cartItem.model.js';

const getOrCreateCart = async (userId) => {
    let cart = await cartModel.getActiveCart(userId);
    if (!cart) {
        const cartId = await cartModel.createCart(userId);
        cart = await cartModel.getActiveCart(userId);
    }
    return cart;
};

const addToCart = async (userId, medicineId, quantity) => {
    const cart = await getOrCreateCart(userId);
    return await cartItemModel.addItem(cart.id, medicineId, quantity);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
    const cart = await getOrCreateCart(userId);
    console.log(cart);
    // Verify item belongs to user's cart
    const itemBelongsToCart = cart.items.some(item => item.id === parseInt(itemId, 10));

    console.log("item id: " + itemId);
    if (!itemBelongsToCart) {
        throw new Error('Item does not belong to user\'s cart');
    }
    return await cartItemModel.updateItemQuantity(itemId, quantity);
};

const removeItem = async (userId, itemId) => {
    const cart = await getOrCreateCart(userId);
    // Verify item belongs to user's cart
    const itemBelongsToCart = cart.items.some(item => item.id === parseInt(itemId, 10));
    if (!itemBelongsToCart) {
        throw new Error('Item does not belong to user\'s cart');
    }
    return await cartItemModel.removeItem(itemId);
};

const checkout = async (userId) => {
    const cart = await getOrCreateCart(userId);
    return await cartModel.updateCartStatus(cart.id, 'purchased');
};

export const cartService = {
    getOrCreateCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    checkout
};