import { VNPAY_CONFIG } from "../configs/environment.js";
import querystring from "querystring";
import crypto from "crypto";

export const verifyVnpayCallback = (query) => {
    console.log("Entering verifyVnpayCallback...");
    const { vnp_SecureHash, ...vnpParams } = query;
    const { hashSecret } = VNPAY_CONFIG;
  
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {});
  
    const queryString = querystring.stringify(sortedParams);
    const hash = crypto
      .createHmac("sha512", hashSecret)
      .update(queryString)
      .digest("hex");
  
    console.log("VNPay Callback Query:", query);
    console.log("Generated Hash:", hash);
    console.log("Received Hash:", vnp_SecureHash);
  
    return hash === vnp_SecureHash;
  };
  