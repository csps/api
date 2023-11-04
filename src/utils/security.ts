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
 * Generate a hash string with the specified length
 * @param length Length of the hash
 */
export function generateHash(length: number): string {
  return randomBytes(Math.floor(length / 2)).toString('hex');
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