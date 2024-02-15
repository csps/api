import Bun from "bun";

import { randomBytes } from "crypto";
import { ElysiaContext } from "../types";
import { SignJWT } from "jose";

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
 * Generate reference number for ICT Congress
 * @param start Starting number
 */
export function generateICTCongressReference(start: number) {
  return `CSPSICT2024${Math.abs(start).toString().padStart(4, '0')}`;
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
 * Create a session token
 * @param isRefreshToken Whether the token is a refresh token
 * @param data Data to be stored in the token
 * @param exp Expiry time
 */
export async function createSessionToken(isRefreshToken: boolean, data: any, exp: string) {
  const jwt = new SignJWT({ irt: isRefreshToken ? 1 : 0, ...data });

  jwt.setProtectedHeader({ alg: "HS256" })
  jwt.setExpirationTime(exp);

  return await jwt.sign(new TextEncoder().encode(process.env.SECRET_KEY));
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