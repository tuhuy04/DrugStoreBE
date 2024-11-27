import { cartModel } from "../models/cart.model.js";
import { cartItemModel } from "../models/cartItem.model.js";
import { medicineModel } from "../models/medicine.model.js";
import { prescriptionService } from "./prescription.service.js";
import { createVnpayPaymentUrl } from "../middlewares/VnPay.js";
const getOrCreateCart = async (userId) => {
  let cart = await cartModel.getActiveCart(userId);
  if (!cart) {
    const cartId = await cartModel.createCart(userId);
    cart = await cartModel.getActiveCart(userId);
  }
  return cart;
};

const addToCart = async (userId, medicineId, quantity) => {
  // Kiểm tra số lượng trong kho
  const stock = await medicineModel.getMedicineStock(medicineId);

  if (quantity > stock) {
    throw new Error("Not enough stock available");
  }

  const cart = await getOrCreateCart(userId);
  return await cartItemModel.addItem(cart.id, medicineId, quantity);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  // Tìm item trong giỏ hàng
  const item = cart.items.find((item) => item.id === parseInt(itemId, 10));

  if (!item) {
    throw new Error("Item does not exist in user's cart");
  }

  const stock = await medicineModel.getMedicineStock(item.medicineId);

  if (quantity > stock) {
    throw new Error("Not enough stock available");
  }

  return await cartItemModel.updateItemQuantity(itemId, quantity);
};

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  // Verify item belongs to user's cart
  const itemBelongsToCart = cart.items.some(
    (item) => item.id === parseInt(itemId, 10)
  );
  if (!itemBelongsToCart) {
    throw new Error("Item does not belong to user's cart");
  }
  return await cartItemModel.removeItem(itemId);
};

const checkout = async (userId, clientIp) => {
  const cart = await cartModel.getActiveCart(userId);
  if (!cart) {
    throw new Error("No active cart found");
  }
  const totalAmount = Math.round(Number(cart.cartTotal) * 100);
  // const totalAmount = Math.round(cart.cartTotal * 100); 

  const paymentUrl = createVnpayPaymentUrl( 
    cart.id.toString(), 
    totalAmount, 
    clientIp 
  );

  console.log("Cart Total:", cart.cartTotal);
  console.log("Total Amount (after multiply by 100):", totalAmount);
  console.log("Order ID:", cart.id.toString());
  console.log("Client IP:", clientIp);

  return paymentUrl;
};



export const cartService = {
  getOrCreateCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  checkout,
};
