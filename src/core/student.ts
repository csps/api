import type { Response, Request } from "express";
import { result } from "../utils/response";
import Student from "../db/models/student";
import { isNumber } from "../utils/string";
import { ErrorTypes } from "../types";

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
  Student.fromId(parseInt(id), (error, student) => {
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