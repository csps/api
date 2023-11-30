import type { ElysiaContext, ResponseBody } from "../types";
import { EmailType, ErrorTypes } from "../types/enums";
import { status501 } from "../routes";
import { sendEmail } from "../utils/email";

import Student from "../db/models/student";
import response from "../utils/response";
import Strings from "../config/strings";
import Config from "../config";

/**
 * Reset Password API
 * @author mavyfaby (Maverick Fabroa)
 */
export function reset(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "GET":
      return getReset(context);
    case "POST":
      return postReset(context);
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
}

/**
 * POST /reset
 */
async function postReset(context: ElysiaContext) {
  // Get token and new password from request
  const { token, new_password } = context.body || {};

  if (!token) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_EMPTY_TOKEN);
  }

  if (token.length !== Config.TOKEN_LENGTH) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_INVALID_TOKEN);
  }

  if (!new_password) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_EMPTY_PASSWORD);
  }

  if (new_password.trim().length < 8) {
    context.set.status = 400;
    return response.error(Strings.RESET_PASSWORD_LIMIT_PASSWORD);
  }

  try {
    // Update password
    const student = await Student.updatePassword(token, new_password);

    // Send email
    sendEmail({
      type: EmailType.RESET_PASSWORD,
      to: student.email_address,
      subject: Strings.RESET_PASSWORD_EMAIL_SUCCESS_SUBJECT,
      title: Strings.RESET_PASSWORD_EMAIL_SUCCESS_TITLE,
      data: {
        name: `${student.first_name} ${student.last_name}`
      }
    });

    // Return success if no errors
    return response.success(Strings.RESET_PASSWORD_SUCCESS);
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
}
