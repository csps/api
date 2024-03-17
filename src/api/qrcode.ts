import type { ElysiaContext, ResponseBody } from "../types";
import { QRCodeCanvas } from '@loskir/styled-qr-code-node';
import { join } from "path";

import Strings from "../config/strings";
import response from "../utils/response";
import Log from "../utils/log";

import { status501 } from "../routes";
import { setHeader } from "../utils/security";

// Get CSPS Logo
const file = Bun.file(join(import.meta.path, "../../../assets/logo.png"));

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
    // Generate QR Code
    const output = new QRCodeCanvas({
      width: size ? parseInt(size) : 512,
      height: size ? parseInt(size) : 512,
      data: q.replace(/\s/g, ''),
      image: Buffer.from(await file.arrayBuffer()),
      margin: 16,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      dotsOptions: {
        type: "square",
        color: theme === 'dark' ? "#988e97" : "#4a2558",
      },
      backgroundOptions: {
        color: "transparent"
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: theme === 'dark' ? "#988e97" : "#4a2558",
      },
      cornersDotOptions: {
        type: "dot",
        color: theme === 'dark' ? "#988e97" : "#4a2558",
      },
    });

    // Output data to buffer
    const buffer = await output.toBuffer("png");

    // Convert buffer to file
    const photo = new File([buffer], "qrcode.png", {
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