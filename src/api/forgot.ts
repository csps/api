import type { ElysiaContext, ResponseBody } from "../types";
import Student from "../db/models/student";
import response from "../utils/response";
import Strings from "../config/strings";

import { status501 } from "../routes";
import { EmailType, ErrorTypes } from "../types/enums";
import { sendEmail } from "../utils/email";
import Log from "../utils/log";
import Config from "../config";

/**
 * Forgot Password API
 * @author mavyfaby (Maverick Fabroa)
 */
export default function forgot(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "POST":
      return postForgot(context);
  }

  return status501(context);
}

/**
 * POST /forgot/:student_id
 */
async function postForgot(context: ElysiaContext) {
  // Get student ID from request body
  const { student_id } = context.body || {};

  // If student ID is not present
  if (!student_id) {
    context.set.status = 400;
    return response.error(Strings.FORGOT_PASSWORD_EMPTY_ID);
  }

  try {
    // Get student
    const student = await Student.getByStudentId(student_id);

    // Anonymous async function
    (async () => {
      // Generate and set reset token
      const token = await Student.addResetToken(student.id);

      // Send email
      sendEmail({
        type: EmailType.FORGOT_PASSWORD,
        to: student.email_address,
        subject: Strings.FORGOT_PASSWORD_EMAIL_SUBJECT,
        title: Strings.FORGOT_PASSWORD_EMAIL_SUBJECT,
        data: {
          name: student.first_name + " " + student.last_name,
          link: Strings.DOMAIN + "/reset/" + token,
          validity: Config.TOKEN_VALIDITY
        }
      });
    })();

    // If student is found, return success
    return response.success(Strings.FORGOT_PASSWORD_SUCCESS_TITLE);
  }
  
  catch (err) {
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.GENERAL_SYSTEM_ERROR);
    }

    // If student is not found, still return success to prevent enumeration
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      // Log error
      Log.e(`Forgot password: Student ${student_id} not found`);
      return response.success(Strings.FORGOT_PASSWORD_SUCCESS_TITLE);
    }
  }
}