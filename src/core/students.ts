import type { Response, Request } from "express";
import { result } from "../utils/response";
import { ErrorTypes } from "../types/enums";
import { isNumber } from "../utils/string";
import { getPattern } from "../utils/route";
import Student from "../db/models/student";
import Strings from "../config/strings";
import { Session } from "../classes/session";

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

  // Otherwisem get all students from the database
  Student.getAll((error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.STUDENTS_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.STUDENTS_NOT_FOUND));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success(Strings.STUDENTS_FOUND, student));
  });
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
  Student.insert(request.body, (error, student) => {
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

  // If value is not present, return invalid request
  if (!value) {
    response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
    return;
  }

  // If key is present and id is empty, get student by token
  if (key && !id) {
    // Get student from token
    Session.getStudentID(request, (error, studentID) => {
      // If session expired
      if (error === ErrorTypes.DB_EXPIRED) {
        response.status(401).send(result.error(Strings.GENERAL_SESSION_EXPIRED));
        return;
      }

      // If unauthorized
      if (error === ErrorTypes.UNAUTHORIZED) {
        response.status(401).send(result.error(Strings.GENERAL_UNAUTHORIZED));
        return;
      }

      // Update student by id
      Student.updateFromID(studentID!, key, value, error => {
        // if has error, map it
        if (error === ErrorTypes.DB_ERROR) {
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        }

        // If id or key is empty
        if (error === ErrorTypes.REQUEST_ID || error === ErrorTypes.REQUEST_KEY) {
          response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
          return;
        }

        // If key is not allowed or value is invalid
        if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED || error === ErrorTypes.REQUEST_VALUE) {
          response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
          return;
        }

        // If update has no affected rows
        if (error === ErrorTypes.DB_EMPTY_RESULT) {
          response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
          return;
        }

        // Otherwise, return success
        response.send(result.success(Strings.STUDENT_UPDATED));
      });
    });

    return;
  }

  // If id or key is not present, return invalid request
  if (!id || !key || !isNumber(id)) {
    response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
    return;
  }

  // Update student by unique id or student id
  Student.update(id, request.originalUrl.indexOf("/uid/") !== -1, key, value, error => {
    // if has error, map it
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // If id or key is empty
    if (error === ErrorTypes.REQUEST_ID || error === ErrorTypes.REQUEST_KEY) {
      response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
      return;
    }

    // If key is not allowed or value is invalid
    if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED || error === ErrorTypes.REQUEST_VALUE) {
      response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
      return;
    }

    // If update has no affected rows
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.STUDENT_NOT_FOUND));
      return;
    }

    // Otherwise, return success
    response.send(result.success(Strings.STUDENT_UPDATED));
  });
}