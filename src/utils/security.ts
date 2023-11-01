import Bun from "bun";

/**
 * Hash a password
 * @param plain plain password
 */
export function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}