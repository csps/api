import type { ElysiaContext, ResponseBody } from "../types";
import Strings from "../config/strings";
import response from "../utils/response";
import Log from "../utils/log";
import QRCode from "qrcode";

import { status501 } from "../routes";
import { setHeader } from "../utils/security";

/**
 * QR Code API
 * @author mavyfaby (Maverick Fabroa)
 */
export function qrcode(context: ElysiaContext): Promise<ResponseBody | File | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getQrcode(context);
  }

  return status501(context);
}

/**
 * GET qrcode/:q
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 * @returns 
 */
async function getQrcode(context: ElysiaContext) {
  // Get data to encode
  const { size, q, theme } = context.query || {};

  // If no data
  if (!q) {
    return response.error(Strings.QRCODE_EMPTY_DATA);
  }

  try {
    // Generate QR Code buffer imaage from query data
    const output = await QRCode.toBuffer(q, {
      width: size ? parseInt(size) : 512,
      type: 'png',
      margin: 1,
      color: {
        dark: theme === 'dark' ? "#988e97" : "#4a2558",
        light: '#0000',
      }
    });

    // Convert buffer to file
    const photo = new File([output], "qrcode.png", {
      type: 'image/png'
    });

    // Set response content type
    setHeader(context, 'Content-Type', 'image/png');

    // Send QR Code to client
    return photo;
  }
  
  catch (error) {
    Log.e(error);
    return response.error(Strings.QRCODE_SERVER_ERROR)
  }
}