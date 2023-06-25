import type { Response, Request } from "express";
import { result } from "../utils/response";
import Student from "../db/models/student";

/**
 * Get student information by its id
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express request
 * @param response Express response
 */
export function student(request: Request, response: Response) {
  // GET /students/:id
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
export function getStudent(request: Request, response: Response) {
  // Get {id} from request parameters
  const { id } = request.params;

  // If id is not a number, return student not found
  if (!(/^\d+$/.test(id))) {
    response.status(404).send(result.error("Student not found!"));
    return;
  }

  // Get the student from the database
  Student.fromId(id, (error, student) => {
    // If error
    if (error !== null || student === null) {
      response.status(404).send(result.error("Student not found!"));
      return;
    }

    // Ohterwise, return the student data
    response.send(result.success("Student found!", student));
  });
}