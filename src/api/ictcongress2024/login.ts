import type { ElysiaContext, ResponseBody } from "../../types";
import { createSessionToken } from "../../utils/security";
import { status501 } from "../../routes";
import { ErrorTypes } from "../../types/enums";
import { jwtVerify } from "jose";
import response from "../../utils/response";
import Strings from "../../config/strings";

import Admin from "../../db/models/ictcongress2024/admin";
import Log from "../../utils/log";

/**
 * ICT Congress Login API
 * @author mavyfaby (Maverick Fabroa)
 */
export function login(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "GET":
      return getLogin(context);
    case "POST":
      return postLogin(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/login
 * @param context Elysia context
 */
async function getLogin(context: ElysiaContext) {
  // Get autorization header
  const { authorization } = context.headers;

  // If token is not specified
  if (!authorization) {
    context.set.status = 200;
    return response.error(Strings.GENERAL_NO_SESSION);
  }

  // Get token from authorization header
  const token = authorization.split(" ")[1];
  
  // Don't proceed if token is not specified or not starting with "ey"
  if (!token || !token.startsWith("ey")) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_INVALID_TOKEN);
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY), {
      algorithms: ["HS256"]
    });
    
    // If token is invalid
    if (!payload) {
      context.set.status = 401;
      return response.error(Strings.LOGIN_INVALID_TOKEN);
    }

    // If token is valid, get admin
    const admin = await Admin.getByUsername(payload.username as string);

    // If admin is not found
    if (!admin) {
      context.set.status = 404;
      return response.error(Strings.LOGIN_FAILED);
    }

    // Return success and student data
    return response.success(Strings.LOGIN_VALID, {
      campus: admin.campus,
      campus_id:  admin.campus_id,
      username: admin.username,
      campus_name: admin.campus_name
    });
  }

  catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.LOGIN_ERROR_VALIDATING_PASSWORD);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.LOGIN_FAILED);
    }
    
    Log.e(err);
  }
}

/**
 * POST /ictcongress2024/login
 * @param context Elysia context
 */
async function postLogin(context: ElysiaContext) {
  // Get request data
  let { username, password } = context.body || {};

  // If student_id is not specified
  if (!username) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_EMPTY_USERNAME);
  }

  // If password is not specified
  if (!password) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_EMPTY_PASSWORD);
  }

  try {
    const admin = await Admin.getByUsernameAndPassword(username.trim(), password);

    // Data to be stored in the token
    const data = { campus: admin.campus, campus_id: admin.campus_id,  username: admin.username };
    // Create access token (1 day)
    const accessToken = await createSessionToken(false, data, "1d");
    // Create refresh token (15 days)
    const refreshToken = await createSessionToken(true, data, "3d");

    // Return success and user data
    return response.success(Strings.LOGIN_SUCCESS, { admin: { ...data, campus_name: admin.campus_name }, accessToken, refreshToken });
  }

  catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.LOGIN_ERROR_VALIDATING_PASSWORD);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT || err === ErrorTypes.UNAUTHORIZED) {
      context.set.status = 404;
      return response.error(Strings.LOGIN_FAILED);
    }

    Log.e(err);
  }
}
