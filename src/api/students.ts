import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";

import Student from "../db/models/student";
import response from "../utils/response";
import Strings from "../config/strings";
import { status501 } from "../routes";

/**
 * Students API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function students(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getStudents(context);
    case "POST":
      return postStudents(context);
  }

  return status501(context);
}

/**
 * GET /students
 * @param context
 */
async function getStudents(context: ElysiaContext) {
  // Get all students
  try {
    const students = await Student.getAll();
    return response.success(Strings.STUDENTS_FOUND, students);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.STUDENTS_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.STUDENTS_NOT_FOUND);
    }
  }
}

/**
 * POST /students (create)
 */
async function postStudents(context: ElysiaContext) {
  try {
    // Insert new student
    await Student.insert(context.body);
    // If no error, student is created
    return response.success(Strings.STUDENT_CREATED);
  }

  catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.STUDENT_POST_ERROR);
    }
  }
}


export default students