import type { Request, Response } from "express";

import { result } from "../utils/response";
import { ErrorTypes } from "../types/enums";
import { Log } from "../utils/log";
import { sendEmail } from "../utils/smtp";
import { generateToken } from "../utils/security";

import Student from "../db/models/student";
import Strings from "../config/strings";
import Config from "../config/app";

/**
 * Forgot Password API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function forgotPassword(request: Request, response: Response) {
  // Map request method
  switch (request.method) {
    case 'POST':
      postForgotPassword(request, response);
      break;
  }
}

/**
 * POST /forgot-password/:student_id
 */
export function postForgotPassword(request: Request, response: Response) {
  // Get student ID from request body
  const { student_id } = request.body;

  // If student ID is empty
  if (student_id === undefined || student_id === "") {
    response.status(400).send(result.error(Strings.FORGOT_PASSWORD_EMPTY_ID));
    return;
  }

  // Get student by ID
  Student.fromId(student_id, (error, student) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // If student not found, log error and send success response
    // even though the student is not found to prevent enumeration
    // (enumeration refers to the process of trying to find all the values of a particular type of data.)
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      Log.e(`Student ID ${student_id} not found!`);
      response.status(200).send(result.success(Strings.FORGOT_PASSWORD_SUCCESS_TITLE, Strings.FORGOT_PASSWORD_SUCCESS_MESSAGE));
      return;
    }
    
    // Generate password token
    const token = generateToken(Config.TOKEN_LENGTH);
    // Send success message response immediately (even though the email is not yet sent) to prevent enumeration
    response.status(200).send(result.success(Strings.FORGOT_PASSWORD_SUCCESS_TITLE, Strings.FORGOT_PASSWORD_SUCCESS_MESSAGE));

    // Add token to database
    student?.addResetToken(token, error => {
      // If database error
      if (error === ErrorTypes.DB_ERROR) {
        Log.e(`Error adding reset password token to database for ${student.getFullname()} (${student_id})`);
        return;
      }

      // Log sending email
      Log.i(`Sending reset password link email to ${student!.getEmailCredential()}.`);
  
      // Otherwise, send email
      sendEmail({
        to: student!.getEmailAddress(),
        title: Strings.FORGOT_PASSWORD_EMAIL_SUBJECT,
        subject: Strings.FORGOT_PASSWORD_EMAIL_SUBJECT,
        message: Strings.FORGOT_PASSWORD_EMAIL_BODY.replace("{name}", student!.getFullname()),
        button: {
          label: "Reset Password",
          url: Strings.DOMAIN + "/reset-password/" + token
        }
      }, (error, info) => {
          // If has error
          if (error !== null) {
            console.log(error);
            Log.e(`Error sending reset password link to ${student!.getEmailCredential()}: ${error.message}`);
            return;
          }
  
          // Log success
          Log.i(`Reset password email link sent to ${student!.getEmailCredential()}.`);
      });
    });
  });
}