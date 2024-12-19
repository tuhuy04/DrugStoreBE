import { cartModel } from "../models/cart.model.js";
import { cartItemModel } from "../models/cartItem.model.js";
import { medicineModel } from "../models/medicine.model.js";
import { createVnpayPaymentUrl } from "../middlewares/vnPay.js";

class CartError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CartError';
  }
}

const getOrCreateCart = async (userId) => {
  try {
    if (!userId) {
      throw new CartError('User ID is required', 401);
    }

    let cart = await cartModel.getActiveCart(userId);

    if (!cart) {
      const cartId = await cartModel.createCart(userId);
      cart = await cartModel.getActiveCart(userId);
      if (!cart) {
        throw new CartError('Failed to create cart', 500);
      }
    }

    if (cart && cart.items) {
      cart.items = cart.items.map(item => {
        if (item.imageUrl && !item.imageUrl.startsWith('http')) {
          item.imageUrl = `${process.env.APP_URL || 'http://localhost:8000'}/${item.imageUrl}`;
        }
        return item;
      });
    }

    return cart;
  } catch (error) {
    if (error instanceof CartError) throw error;
    throw new CartError(error.message || 'Failed to retrieve cart', 500);
  }
};

const addToCart = async (userId, medicineId, quantity) => {
  try {
    if (!medicineId || !quantity) {
      throw new CartError('Medicine ID and quantity are required');
    }

    if (quantity <= 0) {
      throw new CartError('Quantity must be greater than 0');
    }

    const stock = await medicineModel.getMedicineStock(medicineId);
    if (stock === null || stock === undefined) {
      throw new CartError('Medicine not found', 404);
    }

    if (quantity > stock) {
      throw new CartError(`Không đủ số lượng trong kho. Chỉ còn ${stock} sản phẩm.`);
    }

    const cart = await getOrCreateCart(userId);
    
    // Check if item already exists in cart
    const existingItem = cart.items?.find(item => item.medicineId === medicineId);
    if (existingItem && (existingItem.quantity + quantity) > stock) {
      throw new CartError(`Tổng số lượng trong giỏ hàng vượt quá số lượng trong kho (${stock})`);
    }

    return await cartItemModel.addItem(cart.id, medicineId, quantity);
  } catch (error) {
    if (error instanceof CartError) throw error;
    throw new CartError(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng', 500);
  }
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  try {
    if (!itemId || quantity === undefined) {
      throw new CartError('Item ID and quantity are required');
    }

    if (quantity <= 0) {
      throw new CartError('Số lượng phải lớn hơn 0');
    }

    const cart = await getOrCreateCart(userId);
    const item = cart.items?.find((item) => item.id === parseInt(itemId, 10));

    if (!item) {
      throw new CartError("Sản phẩm không tồn tại trong giỏ hàng", 404);
    }

    const stock = await medicineModel.getMedicineStock(item.medicineId);
    if (stock === null || stock === undefined) {
      throw new CartError('Không tìm thấy thông tin sản phẩm', 404);
    }

    if (quantity > stock) {
      throw new CartError(`Không đủ số lượng trong kho. Chỉ còn ${stock} sản phẩm.`);
    }

    return await cartItemModel.updateItemQuantity(itemId, quantity);
  } catch (error) {
    if (error instanceof CartError) throw error;
    throw new CartError(error.message || 'Lỗi khi cập nhật số lượng', 500);
  }
};

const removeItem = async (userId, itemId) => {
  try {
    if (!itemId) {
      throw new CartError('Item ID is required');
    }

    const cart = await getOrCreateCart(userId);
    const itemBelongsToCart = cart.items?.some((item) => item.id === parseInt(itemId, 10));

    if (!itemBelongsToCart) {
      throw new CartError("Sản phẩm không tồn tại trong giỏ hàng", 404);
    }

    return await cartItemModel.removeItem(itemId);
  } catch (error) {
    if (error instanceof CartError) throw error;
    throw new CartError(error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', 500);
  }
};

const checkout = async (userId, clientIp) => {
  try {
    if (!userId || !clientIp) {
      throw new CartError('User ID and client IP are required');
    }

    const cart = await cartModel.getActiveCart(userId);
    if (!cart) {
      throw new CartError("Không tìm thấy giỏ hàng", 404);
    }

    if (!cart.items?.length) {
      throw new CartError("Giỏ hàng trống", 400);
    }

    // Validate stock one more time before checkout
    for (const item of cart.items) {
      const stock = await medicineModel.getMedicineStock(item.medicineId);
      if (item.quantity > stock) {
        throw new CartError(`Sản phẩm "${item.medicineName}" không đủ số lượng trong kho (còn ${stock})`);
      }
    }

    const totalAmount = Math.round(Number(cart.cartTotal) * 100);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new CartError('Số tiền không hợp lệ');
    }

    const paymentUrl = createVnpayPaymentUrl(cart.id.toString(), totalAmount, clientIp);
    if (!paymentUrl) {
      throw new CartError('Không thể tạo URL thanh toán', 500);
    }

    return paymentUrl;
  } catch (error) {
    if (error instanceof CartError) throw error;
    throw new CartError(error.message || 'Lỗi trong quá trình thanh toán', 500);
  }
};

export const cartService = {
  getOrCreateCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  checkout,
};