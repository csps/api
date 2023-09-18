import { QRCodeCanvas } from '@loskir/styled-qr-code-node';
import { Request, Response } from 'express';
import { result } from '../utils/response';
import { Log } from '../utils/log';

import Strings from '../config/strings';
import fs from "fs";
import path from "path";

/**
 * QR Code API
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * @author mavyfaby (Maverick G. Fabroa)
 * 
 * @param request //Express Request
 * @param response  // Express Response
 */
export function qrcode(request: Request, response: Response) {
  switch (request.method) {
    case "GET":
      getQRCode(request, response);
  }
}

/**
 * GET qrcode/:q
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 * @returns 
 */
function getQRCode(request: Request, response: Response) {
  // Get data to encode
  const { q } = request.params;
  // If dark mode
  const isDark = request.originalUrl.endsWith("/dark");

  // If no data
  if (!q) {
    response.status(400).send(result.error(Strings.QRCODE_EMPTY_DATA));
    return;
  }

  // Get CSPS logo
  fs.readFile(path.resolve(__dirname, "../../assets/csps_logo.png"), (error, logo) => {
    if (error) {
      Log.e(error.message);
      response.status(500).send(result.error(Strings.QRCODE_SERVER_ERROR));
      return;
    }

    // Create QRCode
    const qrCode = new QRCodeCanvas({
      width: 1024,
      height: 1024,
      data: q.replace(/s/g, ""),
      image: logo,
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
        type: "dots",
        color: isDark ? "#988e97" : "#4a2558",
      },
      backgroundOptions: {
        color: "transparent"
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: isDark ? "#988e97" : "#4a2558",
      },
      cornersDotOptions: {
        type: "dot",
        color: isDark ? "#988e97" : "#4a2558",
      },
    });
    
    // Convert to buffer png and respond to client
    qrCode.toBuffer("png").then(buffer => {
      response
        .setHeader("Access-Control-Allow-Origin", "*")
        .setHeader("Cross-Origin-Resource-Policy", "cross-origin")
        .setHeader('Content-Type', "image/png")
        .setHeader('Content-Length', buffer.length)
        .end(buffer);
    })
    .catch((error) => {
      Log.e(error.message);
      response.status(500).send(result.error(Strings.QRCODE_SERVER_ERROR));
    });
  });
}