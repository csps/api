import { ErrorTypes } from "../types/enums";
import { ElysiaContext, ResponseBody } from "../types";

import Strings from "../config/strings";
import response from "../utils/response";
import Course from "../db/models/course";
import { status501 } from "../routes";

/**
 * Course API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
export function courses(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getCourses(context);
    case "POST":
      return postCourses(context);
    case "PUT":
      return putCourses(context);
    case "DELETE":
      return deleteCourses(context);
  }

  return status501(context);
}

/**
 * GET /courses (read)
 */
async function getCourses(context: ElysiaContext) {
  // Get all courses
  try {
    const courses = await Course.getAll();
    return response.success(Strings.COURSES_FOUND, courses);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.COURSES_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.COURSES_NOT_FOUND);
    }
  }
}

/**
 * POST /courses (create)
 */
async function postCourses(context: ElysiaContext) {
  // Get name from request body
  const { name } = context.body as Record<string, string> || {};

  // If name is empty
  if (!name) {
    context.set.status = 400;
    return response.error(Strings.COURSES_EMPTY_NAME);
  }

  try {
    // Insert new env
    await Course.insert(name);
    // If no error, env is created
    return response.success(Strings.COURSES_CREATED);
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.COURSES_POST_ERROR);
    }

    // If already exists
    if (err === ErrorTypes.DB_EXIST) {
      context.set.status = 409;
      return response.error(Strings.COURSES_EXISTS);
    }
  }
}

/**
 * PUT /courses/:id (update)
 */
async function putCourses(context: ElysiaContext) {
  // Get id from request params
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.COURSES_EMPTY_ID);
  }

  // Get name from request body
  const { name } = context.body as Record<string, string> || {};

  // If name is empty
  if (!name) {
    context.set.status = 400;
    return response.error(Strings.COURSES_EMPTY_NAME);
  }

  try {
    // Update course
    await Course.update(id, name);
    // If no error, env is created
    return response.success(Strings.COURSES_UPDATED);
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.COURSES_PUT_ERROR);
    }

    // If already exists
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 409;
      return response.error(Strings.COURSE_NOT_FOUND.replace("{id}", id));
    }
  }
}

/**
 * DELETE /courses/:id (delete)
 */
async function deleteCourses(context: ElysiaContext) {
  // Get id from request params
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.COURSES_EMPTY_ID);
  }

  try {
    // Delete course
    await Course.delete(id);
    // If no error, env is created
    return response.success(Strings.COURSES_DELETED);
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.COURSES_DELETE_ERROR);
    }

    // If already exists
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.COURSE_NOT_FOUND.replace("{id}", id));
    }
  }

}
