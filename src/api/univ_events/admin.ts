import type { ElysiaContext, ResponseBody } from "../../types";
import { createSessionToken } from "../../utils/security";
import { status501 } from "../../routes";
import { AuthType, ErrorTypes } from "../../types/enums";
import { jwtVerify } from "jose";
import response from "../../utils/response";
import Strings from "../../config/strings";

import Student from "../../db/models/univ_events/student";
import Log from "../../utils/log";
import UnivAdmin from "../../db/models/univ_events/admin";

/**
 * UC Days Login API
 * @author TotalElderBerry (huhu)
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
  const student_id = username;
  // If type isnt specified
  
  // If student_id is not specified
  if (!student_id) {
    context.set.status = 400;
    return response.error("Username is required");
  }

  // If password is not specified
  if (!password) {
    context.set.status = 400;
    return response.error("Password is required");
  }

  try {
    const student = await UnivAdmin.getByUsernameAndPassword(student_id.trim(),password);

    // Data to be stored in the token
    const data = { role: AuthType.COLLEGE_ADMIN, ...student };
    // Create access token (1 day)
    const accessToken = await createSessionToken(false, data, "1d");
    // Create refresh token (15 days)
    const refreshToken = await createSessionToken(true, data, "15d");

    // Log the login
    Log.login({
      student_id: student.student_id,
      type: data.role,
      name: `${student.first_name} ${student.last_name}`,
      students_id: student.id,
    });

    // Remove password from user
    delete username.password;

    return response.success(Strings.LOGIN_SUCCESS, { data, accessToken, refreshToken });
  }

  catch (error) {
    Log.e(error);
    return response.error(error);    
  }
}
