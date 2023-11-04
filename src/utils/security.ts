import Bun from "bun";
import { ElysiaContext } from "../types";

/**
 * Hash a password
 * @param plain plain password
 */
export function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
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