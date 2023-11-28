import type { ElysiaContext, ResponseBody } from "../types";
import { AuthType, ErrorTypes } from "../types/enums";
import { status501 } from "../routes";

import response from "../utils/response";
import Strings from "../config/strings";
import Student from "../db/models/student";
import Log from "../utils/log";

/**
 * Login API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * @author mavyfaby (Maverick Fabroa)
 */
export default function login(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
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
  // Get token from cookie
  const { token } = context.cookie;

  // If token is not specified
  if (!token) {
    context.set.status = 200;
    return response.error(Strings.GENERAL_NO_SESSION);
  }

  try {
    // Verify token
    const decoded = await context.jwt.verify(token);
    
    // If token is invalid
    if (!decoded) {
      context.set.status = 401;
      return response.error(Strings.LOGIN_INVALID_TOKEN);
    }

    // Get Role
    const role = decoded.admin_id ? AuthType.ADMIN : AuthType.STUDENT;

    // If token is valid, get student
    const student = await Student.getByStudentId(role === AuthType.ADMIN ? decoded.admin_id : decoded.student_id);

    // If student is not found
    if (!student) {
      context.set.status = 404;
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
      context.set.status = 404;
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
  
    // Generate token
    const token = await context.jwt.sign({
      [type == AuthType.ADMIN ? 'admin_id' : 'student_id']: user.student_id
    });
  
    context.setCookie("token", token, {
      maxAge: 24 * 60 * 60, // 1 day
    });
  
    // Remove password from user
    delete user.password;
    // Return success and user data
    return response.success(Strings.LOGIN_SUCCESS, user);
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