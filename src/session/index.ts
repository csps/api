import { ElysiaContext } from "../types";
import { AuthType } from "../types/enums";
import { jwtVerify } from "jose";
import Log from "../utils/log";
import { createSessionToken, setHeader } from "../utils/security";

/**
 * Get user role from token
 * @author mavyfaby (Maverick Fabroa)
 * @param context Elysia context
 */
export async function validateAndGetRole(context: ElysiaContext): Promise<AuthType | false | null> {
  // Get authorization header
  const { authorization } = context.headers;
  // Don't proceed if authorization is not specified
  if (!authorization) return null;
  // Get token from authorization header
  const token = authorization.split(" ")[1];
  // Don't proceed if token is not specified or not starting with "ey"
  if (!token || !token.startsWith("ey")) return null;

  try {
    // Verify token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
    // Don't proceed If token is invalid
    if (!payload) return null;
    // Set user in context
    context.user = payload;

    // If using refresh token
    if (payload.irt === 1) {
      delete payload.irt;
      Log.i("Using refresh token", true);
      setHeader(context, "Authorization", `Bearer ${await createSessionToken(false, payload, "1d")}`)
    }

    // Return appropriate auth type
    return payload.role as AuthType;
  }

  catch (err: any) {
    if (err.code === "ERR_JWT_EXPIRED") {
      return false;
    }

    Log.e(err);
  }

  return null;
}
