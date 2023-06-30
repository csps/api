import { result } from "../utils/response";
import { isNumber } from "../utils/string";
import { ErrorTypes } from "../types";

import type { Response, Request } from "express";

import Student from "../db/models/student";

/**
 * Student API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express request
 * @param response Express response
 */
export function student(request: Request, response: Response) {
  switch (request.method) {
    case 'GET':
      getStudent(request, response);
      break;
    case 'POST':
      postStudent(request, response);
  }
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
    response.status(404).send(result.error("Student not found!"));
    return;
  }

  // Get the student from the database
  Student.fromId(id, (error, student) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting student from database."));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("No student found."));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success("Student found!", student));
  });
}

/**
 * POST /student
 * 
 * @param request Express request
 * @param response Express response
 */
function postStudent(request: Request, response: Response) {
  // Validate the student data
  const validation = Student.validate(request.body);

  // If has an error
  if (validation) {
    response.status(400).send(result.error(validation[0], validation[1]));
    return;
  }

  // Insert the student to the database
  Student.insert(request.body, (error, student) => {
    // If has an error
    switch (error) {
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error("Error inserting student to database."));
        return;
      case ErrorTypes.DB_STUDENT_ALREADY_EXISTS:
        response.status(400).send(result.error("Student already exists.", "student_id"));
        return;
      case ErrorTypes.DB_EMAIL_ALREADY_EXISTS:
        response.status(400).send(result.error("Email already exists.", "email"));
        return;
    }

    // Otherwise, return the student data
    response.send(result.success("Student created!", student));
  });
}