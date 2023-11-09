import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";
import { status501 } from "../routes";

import response from "../utils/response";
import Strings from "../config/strings";
import Config from "../config";
import Student from "../db/models/student";

/**
 * Reset Password API
 * @author mavyfaby (Maverick Fabroa)
 */
export default function reset(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "GET":
      return getReset(context);
  }

  return status501(context);
}

/**
 * GET /reset/:token
 */
async function getReset(context: ElysiaContext) {
  // Get token param
  const { token } = context.params || {};

  if (!token) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_EMPTY_TOKEN);
  }

  if (token.length !== Config.TOKEN_LENGTH) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_INVALID_TOKEN);
  }

  try {
    // Search student from token
    await Student.fromResetToken(token);
    // Return success if no errors
    return response.success();
  }

  catch (error) {
    if (error === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.GENERAL_SYSTEM_ERROR);      
    }

    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 400;
      return response.error(Strings.RESET_PASSWORD_INVALID_TOKEN);
    }

    if (error === ErrorTypes.DB_USED) {
      context.set.status = 400;
      return response.error(Strings.RESET_PASSWORD_TOKEN_USED);
    }

    if (error === ErrorTypes.DB_EXPIRED) {
      context.set.status = 400;
      return response.error(Strings.RESET_PASSWORD_EXPIRED);
    }
  }

  return response.success();
}