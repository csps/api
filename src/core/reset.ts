import type { Request, Response } from "express";

import { result } from "../utils/response";
import { ErrorTypes } from "../types/enums";
import { Log } from "../utils/log";

import Config from "../config/app";
import Strings from "../config/strings";
import Student from "../db/models/student";

/**
 * Reset Password API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function resetPassword(request: Request, response: Response) {
  // Map request method
  switch (request.method) {
    case 'GET':
      getResetPassword(request, response);
      break;
    case 'POST':
      postResetPassword(request, response);
      break;
  }
}

/**
 * GET /reset-password/:token
 */
export function getResetPassword(request: Request, response: Response) {
  // Get token from request params
  const { token } = request.params;
  
  // If token is empty
  if (!token) {
    response.status(400).send(result.error(Strings.RESET_PASSWORD_EMPTY_TOKEN));
    return;
  }

  // If token length is incorrect
  if (token.trim().length !== Config.TOKEN_LENGTH) {
    response.status(400).send(result.error(Strings.RESET_PASSWORD_INVALID_TOKEN));
    return;
  }

  // Get student from token
  Student.fromResetToken(token, (error, student) => {
    // If has error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // If no result
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(400).send(result.error(Strings.RESET_PASSWORD_INVALID_TOKEN));
      return;
    }

    // If token already used
    if (error === ErrorTypes.DB_USED) {
      response.status(400).send(result.error(Strings.RESET_PASSWORD_TOKEN_USED));
      return;
    }

    // If expired
    if (error === ErrorTypes.DB_EXPIRED) {
      response.status(400).send(result.error(Strings.RESET_PASSWORD_EXPIRED));
      return;
    }

    // If no error, send success response
    response.status(200).send(result.success());
  });
}

/**
 * POST /reset-password/:token
 */
export function postResetPassword(request: Request, response: Response) {
  // Get token and new password from request body
  const { token, new_password } = request.body;

  // If token is empty
  if (!token) {
    response.status(400).send(result.error(Strings.RESET_PASSWORD_EMPTY_TOKEN));
    return;
  }

  // If token length is incorrect
  if (token.trim().length !== Config.TOKEN_LENGTH) {
    response.status(400).send(result.error(Strings.RESET_PASSWORD_INVALID_TOKEN));
    return;
  }

  // If new password is empty
  if (!new_password) {
    response.status(400).send(result.error(Strings.STUDENT_EMPTY_PASSWORD));
    return;
  }

  // If new password is less than 8 characters
  if (new_password.trim().length < 8) {
    response.status(400).send(result.error(Strings.RESET_PASSWORD_LIMIT_PASSWORD));
    return;
  }

  // Get student from token
  Student.fromResetToken(token, (error, student) => {
    // If has error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // If no result
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(400).send(result.error(Strings.RESET_PASSWORD_INVALID_TOKEN));
      return;
    }
    
    // Reset password
    student!.resetPassword(token, new_password, error => {
      // If db error
      if (error === ErrorTypes.DB_ERROR) {
        response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
        return;
      }

      // If hash error
      if (error === ErrorTypes.HASH_ERROR) {
        response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
        return;
      }

      // If token not found
      if (error === ErrorTypes.DB_EMPTY_RESULT) {
        response.status(500).send(result.error(Strings.RESET_PASSWORD_INVALID_TOKEN));
        return;
      }

      // If token already used
      if (error === ErrorTypes.DB_USED) {
        response.status(400).send(result.error(Strings.RESET_PASSWORD_TOKEN_USED));
        return;
      }

      // If epired
      if (error === ErrorTypes.DB_EXPIRED) {
        response.status(400).send(result.error(Strings.RESET_PASSWORD_EXPIRED));
        return;
      }

      // Log message
      Log.i(`Student ${student!.getFullname()} (${student!.getStudentId()}) resets password.`);
      // If no error, send success response
      response.status(200).send(result.success(Strings.RESET_PASSWORD_SUCCESS));
    });
  });
}