import { verifyVnpayCallback } from '../services/vnpay.service.js';
import { cartService } from '../services/cart.service.js';
import { prescriptionService } from '../services/prescription.service.js';
import { cartModel } from '../models/cart.model.js';
export const handleVnpayCallback = async (req, res) => {
    try {
      const vnpParams = req.query;
      const isValidSignature = verifyVnpayCallback(vnpParams);
  
      if (!isValidSignature) {
        console.log('Invalid signature:', vnpParams);
        return res.status(400).json({
          code: '97',
          message: 'Invalid signature'
        });
      }
  
      const { vnp_ResponseCode, vnp_TxnRef } = vnpParams;
  
      if (vnp_ResponseCode === '00') {
        await cartService.updateCartStatus(vnp_TxnRef, 'purchased');
        const cart = await cartModel.getPurchasedCart(vnp_TxnRef);
        await prescriptionService.createPrescription(cart.userId, cart.id);
        
        return res.status(200).json({
          code: '00',
          message: 'Success'
        });
      }
  
      return res.status(400).json({
        code: vnp_ResponseCode,
        message: 'Payment failed'
      });
  
    } catch (error) {
      console.error('Payment processing error:', error);
      return res.status(500).json({
        code: '99',
        message: 'Internal server error'
      });
    }
  };