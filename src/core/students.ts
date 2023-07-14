import type { Response, Request } from "express";
import { result } from "../utils/response";
import { ErrorTypes } from "../types/enums";
import { isNumber } from "../utils/string";
import Student from "../db/models/student";

import {
  STUDENTS_GET_ERROR, STUDENTS_NOT_FOUND, STUDENTS_FOUND,
  STUDENT_GET_ERROR, STUDENT_NOT_FOUND, STUDENT_FOUND,
  STUDENT_POST_ERROR, STUDENT_ALREADY_EXIST, STUDENT_CREATED,
  STUDENT_EMAIL_ALREADY_EXIST
} from "../strings/strings.json";

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
  }
}

/**
 * GET /students
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudents(request: Request, response: Response) {
  // Get {id} from request parameters
  const { id } = request.params;

  // If has an id, call `getStudent` function instead
  if (id) {
    getStudent(request, response);
    return;
  }

  // Get the student from the database
  Student.getAll((error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(STUDENTS_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(STUDENTS_NOT_FOUND));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success(STUDENTS_FOUND, student));
  });
}

/**
 * GET /students/:id
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudent(request: Request, response: Response) {
  // Get {id} from request parameters
  const { id } = request.params;

  // If id is not a number, return student not found
  if (!isNumber(id)) {
    response.status(404).send(result.error(STUDENT_NOT_FOUND));
    return;
  }

  // Get the student from the database
  Student.fromId(id, (error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(STUDENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(STUDENT_NOT_FOUND));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success(STUDENT_FOUND, student));
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
        response.status(500).send(result.error(STUDENT_POST_ERROR));
        return;
      case ErrorTypes.DB_STUDENT_ALREADY_EXISTS:
        response.status(400).send(result.error(STUDENT_ALREADY_EXIST, "student_id"));
        return;
      case ErrorTypes.DB_EMAIL_ALREADY_EXISTS:
        response.status(400).send(result.error(STUDENT_EMAIL_ALREADY_EXIST, "email"));
        return;
    }

    // Otherwise, return the student data
    response.send(result.success(STUDENT_CREATED, student));
  });
}