import type { ElysiaContext, ResponseBody } from "../../types";
import { createSessionToken } from "../../utils/security";
import { status501 } from "../../routes";
import { AuthType, ErrorTypes } from "../../types/enums";
import { jwtVerify } from "jose";
import response from "../../utils/response";
import Strings from "../../config/strings";

import Admin from "../../db/models/ucdays2024/admin";
import Log from "../../utils/log";

/**
 * UC Days Login API
 * @author mavyfaby (Maverick Fabroa)
 */
export function login(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "POST":
      return postLogin(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * POST /ucdays2024/login
 * @param context Elysia context
 */
async function postLogin(context: ElysiaContext) {
  // Get request data
  let { username, password } = context.body || {};

  // If student_id is not specified
  if (!username) {
    context.set.status = 400;
    return response.error("Username is required");
  }

  // If password is not specified
  if (!password) {
    context.set.status = 400;
    return response.error("Password is required");
  }

  try {
    const admin = await Admin.getByUsernameAndPassword(username.trim(), password);

    // Data to be stored in the token
    const data = { role: AuthType.COLLEGE_ADMIN, college_id: admin.college_id, username: admin.username };
    // Create access token (1 day)
    const accessToken = await createSessionToken(false, data, "1d");
    // Create refresh token (15 days)
    const refreshToken = await createSessionToken(true, data, "3d");

    // Return success and user data
    return response.success(Strings.LOGIN_SUCCESS, { admin: data, accessToken, refreshToken });
  }

  catch (error) {
    Log.e(error);
    return response.error(error);    
  }
}
