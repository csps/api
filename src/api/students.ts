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
export function students(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getStudents(context);
    case "POST":
      return postStudents(context);
    case "PUT":
      return putStudents(context);
    case "OPTIONS":
      return response.success();
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
    const students = await Student.getAll(context.query);
    return response.success(Strings.STUDENTS_FOUND, ...students);
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

/**
 * PUT /students/:student_id (update)
 */
async function putStudents(context: ElysiaContext) {
  // Get student_id from request params
  const { student_id } = context.params || {};

  // If updating password
  if (context.path.endsWith("/password")) {
    try {
      const { pass1, pass2 } = context.body || {};
      const p1 = pass1.trim();
      const p2 = pass2.trim();

      // If password is empty
      if (!p1 || !p2) {
        context.set.status = 400;
        return response.error(Strings.STUDENT_EMPTY_PASSWORD);
      }
      
      // If passwords do not match
      if (p1 !== p2) {
        context.set.status = 400;
        return response.error(Strings.STUDENT_PASSWORD_MISMATCH);
      }

      // If password is too short
      if (p1.length < 8) {
        context.set.status = 400;
        return response.error(Strings.STUDENT_PASSWORD_TOO_SHORT);
      }

      // Update student password
      await Student.updatePassword(context.user.student_id, p1);
      // If no error, student password is updated
      return response.success(Strings.STUDENT_PASSWORD_UPDATED);
    }

    catch (err) {
      if (err === ErrorTypes.DB_EMPTY_RESULT) {
        context.set.status = 404;
        return response.error(Strings.STUDENT_NOT_FOUND);
      }

      if (err === ErrorTypes.DB_ERROR) {
        context.set.status = 500;
        return response.error(Strings.STUDENT_PASSWORD_UPDATE_ERROR);
      }
    }

    return response.error(Strings.STUDENT_UPDATE_ERROR);
  }

  // If student_id is empty
  if (!student_id) {
    context.set.status = 400;
    return response.error(Strings.STUDENT_EMPTY_ID);
  }

  try {
    // Update student
    await Student.update(student_id, context.body);
    // If no error, student is updated
    return response.success(Strings.STUDENT_UPDATED);
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
      return response.error(Strings.STUDENT_UPDATE_ERROR);
    }
  }
}
