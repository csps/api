import { jwt } from "@elysiajs/jwt";
import { ElysiaContext } from "../types";
import { AuthType } from "../types/enums";
import Log from "../utils/log";

export const jwtConfig = jwt({
  name: "jwt",
  secret: process.env.SECRET_KEY,
  exp: "1d",
});

/**
 * Session checker middleware
 * @author mavyfaby (Maverick Fabroa)
 * @param context Elysia context
 */
export async function getRole(context: ElysiaContext): Promise<AuthType | null> {
  // Get token from cookies
  const { token } = context.cookie;
  // Don't proceed if token is not specified
  if (!token) return null;

  try {
    // Verify token
    const decoded = await context.jwt.verify(token);
    // Don't proceed If token is invalid
    if (!decoded) return null;

    // Return appropriate auth type
    if ("admin_id" in decoded) return AuthType.ADMIN;
    if ("student_id" in decoded) return AuthType.STUDENT;
    return null;
  }

  catch (err) {
    Log.e(err);
  }

  return null;
}