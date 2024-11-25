import crypto from "crypto";
import querystring from "querystring";
import { VNPAY_CONFIG } from "../configs/environment.js";

export const createVnpayPaymentUrl = (orderId, amount, ipAddress) => {
  const { tmnCode, hashSecret, vnpUrl, returnUrl } = VNPAY_CONFIG;

  const currentDate = new Date();
  const vietnamTime = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);
  const vnpCreateDate = vietnamTime.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const vnpExpireDateStr = new Date(vietnamTime.getTime() + 30 * 60 * 1000)
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const params = {
    vnp_Amount: amount * 100, // Đổi sang đơn vị VNĐ
    vnp_Command: "pay",
    vnp_CreateDate: vnpCreateDate,
    vnp_CurrCode: "VND",
    vnp_ExpireDate: vnpExpireDateStr,
    vnp_IpAddr: ipAddress,
    vnp_Locale: "vn",
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_ReturnUrl: returnUrl,
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: orderId,
    vnp_Version: "2.1.0",
  };

  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value) // Loại bỏ null/undefined
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value.toString();
      return obj;
    }, {});

  const queryString = querystring.stringify(sortedParams);
  const hash = crypto.createHmac("sha512", hashSecret).update(Buffer.from(queryString, "utf-8")).digest("hex");

  // Tạo URL redirect
  const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${hash}`;
  console.log("Payment URL:", paymentUrl);

  return paymentUrl;
};
