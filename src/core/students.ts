import type { Response, Request } from "express";
import { result } from "../utils/response";
import Student from "../db/models/student";
import { ErrorTypes } from "../types";

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
  }
}

/**
 * GET /students
 * 
 * @param request Express request
 * @param response Express response
 */
function getStudents(request: Request, response: Response) {
  // Get the student from the database
  Student.getAll((error, student) => {
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
    response.send(result.success("Students found!", student));
  });
}