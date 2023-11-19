import Bun from "bun";

import { randomBytes } from "crypto";
import { ElysiaContext } from "../types";

/**
 * Hash a password
 * @param plain plain password
 */
export function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}

/**
 * Generate reference number
 * @param start Starting number
 */
export function generateReference(start: number) {
  // Get date
  const date = new Date();
  // Get year, month, date
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `CSPS${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}${Math.abs(start).toString().padStart(3, '0')}`;
}

/**
 * Generate secure token
 */
export function generateToken(length = 16): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(length / 2, (err, buf) => {
      // If error
      if (err) return reject(err);
      // Resolve promise
      resolve(buf.toString('hex'));
    });
  });
}

/**
 * Set a header
 * @param context Elysia context
 * @param key Header key
 * @param value Header value
 */
export function setHeader(context: ElysiaContext, key: string, value: string) {
  context.set.headers[key] = value;
}