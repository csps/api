import type { Response, Request } from "express";
import { result } from "../utils/response";
import { AuthType, ErrorTypes } from "../types/enums";
import { isNumber } from "../utils/string";
import { StudentColumns } from "../db/structure";
import { Log } from "../utils/log";
import Student from "../db/models/student";
import Strings from "../config/strings";
import bcrypt from "bcrypt";

/**
 * Students API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express request
 * @param response Express response
 */
export function students(request: Request, response: Response) {
  switch (request.method) {
    case 'GET':
      getStudents(request, response);
      break;
    case 'POST':
      postStudents(request, response);
      break;
    case 'PUT':
      putStudents(request, response);
      break;
  }
}

/**
 * GET /students
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudents(request: Request, response: Response) {
  // If using uid
  const isUid = request.originalUrl.indexOf("/uid/") !== -1;
  // If using student id
  const isStudentId = request.originalUrl.indexOf("/id/") !== -1;
  // Get id (either uid or student id)
  const { id } = request.params;

  // If using uid
  if (isUid) {
    // If uid is not a number
    if (!isNumber(id)) {
      response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
      return;
    }

    // Get students by unique id
    getStudentByUID(request, response)
    return
  }

  // If using student id
  if (isStudentId) {
    // If id is not a number
    if (!isNumber(id)) {
      response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
      return;
    }

    // Get student by id
    getStudentByID(request, response);
    return;
  }

   // If admin
   if (response.locals.role === AuthType.ADMIN) {
    // Get all students
    Student.find(request.query, (error, students, count) => {
      if (error === ErrorTypes.DB_ERROR) {
        response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
        return;
      }

      if (error === ErrorTypes.DB_EMPTY_RESULT) {
        response.status(200).send(result.error(Strings.STUDENTS_NOT_FOUND));
        return;
      }

      if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED) {
        response.status(400).send(result.error(Strings.GENERAL_COLUMN_NOT_FOUND));
        return;
      } 

        response.status(200).send(result.success(Strings.STUDENTS_FOUND, students, count));
      });

      return;
    }

    response.status(401).send(result.success(Strings.GENERAL_UNAUTHORIZED));
  }

/**
 * GET /students/id/:id
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudentByID(request: Request, response: Response) {
  // Get student id from request parameters
  const { id } = request.params;

  // If id is not a number, return student not found
  if (!isNumber(id)) {
    response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
    return;
  }

  // Get the student from the database
  Student.fromId(id, (error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.STUDENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success(Strings.STUDENT_FOUND, student));
  });
}

/**
 * GET /students/uid/:id
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudentByUID(request: Request, response: Response) {
  // Get student id from request parameters
  const { uid } = request.params;

  // If uid is not a number, return student not found
  if (!isNumber(uid)) {
    response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
    return;
  }

  // Get the student from the database
  Student.fromUniqueId(uid, (error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.STUDENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success(Strings.STUDENT_FOUND, student));
  });
}

/**
 * POST /students
 * @param request 
 * @param response 
 */
function postStudents(request: Request, response: Response) {
  // Validate the student data
  const error = Student.validate(request.body);

  // If has an error
  if (error) {
    response.status(400).send(result.error(error[0], error[1]));
    return;
  }

  // Insert the student to the database
  Student.insert(request.body, (error, student, plainPassword) => {
    // If has an error
    switch (error) {
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(Strings.STUDENT_POST_ERROR));
        return;
      case ErrorTypes.DB_STUDENT_ALREADY_EXISTS:
        response.status(400).send(result.error(Strings.STUDENT_ALREADY_EXIST, "student_id"));
        return;
      case ErrorTypes.DB_EMAIL_ALREADY_EXISTS:
        response.status(400).send(result.error(Strings.STUDENT_EMAIL_ALREADY_EXIST, "email"));
        return;
    }

    // If no errors, send email
    student?.sendNewAccountEmail(plainPassword!);
    // Otherwise, return the student data
    response.send(result.success(Strings.STUDENT_CREATED, student));
  });
}

/**
 * PUT /students
 * @param request 
 * @param response 
 */
function putStudents(request: Request, response: Response) {
  // Get id and key from request parameters
  const { id, key } = request.params;
  // Get value from request body
  const { value } = request.body;
  // Is using unique id
  const isUid = request.originalUrl.indexOf("/uid/") !== -1;

  // If changing password
  if (key === StudentColumns.PASSWORD) {
    // Get inputs
    const { oldpass, newpass, cnfpass } = request.body;

    // If old password is empty
    if (!oldpass) {
      response.status(400).send(result.error(Strings.STUDENT_EMPTY_OLD_PASS));
      return;
    }

    // If new password is empty or less than 8 characters
    if (!newpass || newpass.length < 8) {
      response.status(400).send(result.error(Strings.STUDENT_INVALID_PASSWORD));
      return;
    }

    // If confirm password doesnt match
    if (newpass !== cnfpass) {
      response.status(400).send(result.error(Strings.STUDENT_PASSWORDS_DOESNT_MATCH));
      return;
    }

    // If no id
    if (!id) {
      // If not logged in
      if (!response.locals.studentID) {
        response.status(401).send(result.error(Strings.GENERAL_UNAUTHORIZED));
        return;
      }

      // Compare old password if correct
      Student.isPasswordMatch(response.locals.studentID, oldpass, (error, isMatch) => {
        // If error
        if (error === ErrorTypes.DB_ERROR) {
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        }

        // If no result
        if (error === ErrorTypes.DB_EMPTY_RESULT) {
          response.status(500).send(result.error(Strings.STUDENT_NOT_FOUND));
          return;
        }

        // If incorrect old password
        if (!isMatch) {
          response.status(400).send(result.error(Strings.STUDENT_INCORRECT_OLD_PASS));
          return;
        }

        // Hash password
        bcrypt.hash(newpass, 10, (error, hash) => {
          // If error
          if (error) {
            Log.e("[Students] Error hashing password!");
            response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
            return;
          }

          // Update password
          Student.update(response.locals.studentID!, false, key, hash, error => {
            // If has errors
            if (_checkUpdateError(error, response)) return;
            // Show success
            response.send(result.success(Strings.STUDENT_UPDATED));
          });
        });

      });

      return;
    }

    // If using id
    Student.update(id, isUid, key, newpass, error => {
      // If has errors
      if (_checkUpdateError(error, response)) return;
      // Show success
      response.send(result.success(Strings.STUDENT_UPDATED));
    });
  }

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.GENERAL_INCORRECT_VALUE));
    return;
  }

  // If no id
  if (!id) {
    // If not logged in
    if (!response.locals.studentID) {
      response.status(401).send(result.error(Strings.GENERAL_UNAUTHORIZED));
      return;
    }

    // Get student id and update student from response locals
    Student.update(response.locals.studentID, false, key, value, error => {
      // If has errors
      if (_checkUpdateError(error, response)) return;
      // Show success
      response.send(result.success(Strings.STUDENT_UPDATED));
    });

    return;
  }

  // If id is empty, not a number, or key is empty
  if (!id || !isNumber(id) || !key) {
    response.status(404).send(result.error(Strings.GENERAL_INVALID_REQUEST));
    return;
  }

  // Update student
  Student.update(id, isUid, key, value, error => {
    // If has errors
    if (_checkUpdateError(error, response)) return;
    // Show success
    response.send(result.success(Strings.STUDENT_UPDATED));
  });
}

/**
 * Check student update error
 */
function _checkUpdateError(error: ErrorTypes | null, response: Response) {
  // If database error
  if (error === ErrorTypes.DB_ERROR) {
    response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
    return true;
  }

  // If empty id
  if (error === ErrorTypes.REQUEST_ID) {
    Log.e("[Students] Empty ID!");
    response.status(400).send(result.error(Strings.STUDENT_UPDATE_ERROR));
    return true;
  }

  // If empty key
  if (error === ErrorTypes.REQUEST_KEY) {
    Log.e("[Students] Empty key!");
    response.status(400).send(result.error(Strings.STUDENT_UPDATE_ERROR));
    return true;
  }

  // If key not allowed
  if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED) {
    Log.e("[Students] Key not allowed!");
    response.status(400).send(result.error(Strings.GENERAL_KEY_NOT_ALLOWED));
    return true;
  }

  // If empty value
  if (error === ErrorTypes.REQUEST_VALUE) {
    Log.e("[Students] Invalid value!");
    response.status(400).send(result.error(Strings.GENERAL_INCORRECT_VALUE));
    return true;
  }

  // If no result
  if (error === ErrorTypes.DB_EMPTY_RESULT) {
    Log.e("[Students] Student not found!");
    response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
    return true;
  }

  return false;
}