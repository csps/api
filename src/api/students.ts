import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";

import { status501 } from "../routes";
import Student from "../db/models/student";
import response from "../utils/response";
import Strings from "../config/strings";

/**
 * Students API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function students(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getStudents(context);
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

export default students