import type { ElysiaContext, ResponseBody } from "../types";
import { AuthType, ErrorTypes } from "../types/enums";
import { createSessionToken } from "../utils/security";
import { status501 } from "../routes";
import { jwtVerify } from "jose";

import response from "../utils/response";
import Strings from "../config/strings";
import Student from "../db/models/student";
import UnivStudent from "../db/models/univ_events/student";
import Log from "../utils/log";

/**
 * Login API
 * @author TotalElderBerry (Brian Keith Lisondra)
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
 * GET /login
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

    // Get Role
    const role = payload.role as AuthType;
    let student;
    if(role === AuthType.UNIV_ACCOUNT || role === AuthType.COLLEGE_ADMIN){
      student = await UnivStudent.getByStudentId(payload.student_id as string);
    }else{
      // If token is valid, get student
      student = await Student.getByStudentId(payload.student_id as string);
    }

    // If student is not found
    if (!student) {
      context.set.status = 401;
      return response.error(Strings.LOGIN_FAILED);
    }

    // Remove password from student
    delete student.password;
    // Return success and student data
    return response.success(Strings.LOGIN_VALID, student, role);
  }

  catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.LOGIN_ERROR_VALIDATING_PASSWORD);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 401;
      return response.error(Strings.LOGIN_FAILED);
    }
    
    Log.e(err);
  }
}

/**
 * POST /login
 * @param context Elysia context
 */
async function postLogin(context: ElysiaContext) {
  // Get request data
  let { type, student_id, password } = context.body || {};

  // If type is not specified
  if (!type) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_TYPE_NOT_SPECIFIED);
  }

  // If type is not valid
  if (type != AuthType.STUDENT && type != AuthType.ADMIN) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_INVALID_TYPE);
  }

  // If student_id is not specified
  if (!student_id) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_EMPTY_STUDENT_ID);
  }

  // If password is not specified
  if (!password) {
    context.set.status = 400;
    return response.error(Strings.LOGIN_EMPTY_PASSWORD);
  }

  try {
    // User can be either a student or an admin
    const user = await Student.getByStudentId(student_id.trim(), type == AuthType.ADMIN);
  
    // Compare password
    if (!(await Bun.password.verify(password, user.password || ""))) {
      context.set.status = 404;
      return response.error(Strings.LOGIN_FAILED);
    }
  
    // Data to be stored in the token
    const data = { role: type == AuthType.ADMIN ? AuthType.ADMIN : AuthType.STUDENT, ...user };
    // Create access token (1 day)
    const accessToken = await createSessionToken(false, data, "1d");
    // Create refresh token (15 days)
    const refreshToken = await createSessionToken(true, data, "15d");

    // Log the login
    Log.login({
      student_id: user.student_id,
      type: data.role,
      name: `${user.first_name} ${user.last_name}`,
      students_id: user.id,
    });

    // Remove password from user
    delete user.password;
    // Return success and user data
    return response.success(Strings.LOGIN_SUCCESS, { user, accessToken, refreshToken });
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
  }
}
