import type { Request, Response } from "express";
import { Course } from "../db/models/course";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import Strings from "../config/strings";

/**
 * Courses API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function courses(request: Request, response: Response) {
  switch (request.method) {
    case "GET":
      getCourses(request, response);
      break;
    case "POST":
      postCourses(request, response);
      break;
    case "DELETE":
      deleteCourses(request, response);
      break;
    case "PUT":
      putCourses(request, response);
      break;
  }
}

/**
 * GET /courses (read)
 */
function getCourses(request: Request, response: Response) {
  // Get all courses
  Course.getAll((error, courses) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.COURSES_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.COURSES_NOT_FOUND));
      return;
    }

    // Return courses
    response.send(result.success(Strings.COURSES_FOUND, courses));
  });
}

/**
 * POST /courses (create)
 */
function postCourses(request: Request, response: Response) {
  // Get name from request body
  const { name } = request.body;

  // If name is empty
  if (!name) {
    response.status(400).send(result.error(Strings.COURSES_EMPTY_NAME));
    return;
  }

  // Insert course
  Course.insert(name, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.COURSES_POST_ERROR));
      return;
    }

    // If already exists
    if (error === ErrorTypes.DB_EXIST) {
      response.status(400).send(result.error(Strings.COURSES_EXISTS));
      return;
    }

    // Return success
    response.send(result.success(Strings.COURSES_CREATED));
  });
}

/**
 * PUT /courses/:id (update)
 */
function putCourses(request: Request, response: Response) {
  // Get id from request params
  const { id } = request.params;

  // If key is empty
  if (!id) {
    response.status(400).send(result.error(Strings.COURSES_EMPTY_ID));
    return;
  }

  // Get name from request body
  const { value } = request.body;

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.COURSES_EMPTY_NAME));
    return;
  }

  // Update config
  Course.update(id, value, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.COURSES_PUT_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.COURSE_NOT_FOUND.replace("{id}", id)));
      return;
    }

    // Return success
    response.send(result.success(Strings.COURSES_UPDATED));
  });
}


/**
 * DELETE /courses/:id (delete)
 */
function deleteCourses(request: Request, response: Response) {
  // Get id from request params
  const { id } = request.params;

  // If id is empty
  if (!id) {
    response.status(400).send(result.error(Strings.COURSES_EMPTY_ID));
    return;
  }

  // Delete course
  Course.delete(id, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.COURSES_DELETE_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.COURSE_NOT_FOUND.replace("{id}", id)));
      return;
    }

    // Return success
    response.send(result.success(Strings.COURSES_DELETED));
  });
}

