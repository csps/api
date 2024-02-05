import { status501 } from "../../routes";
import { ElysiaContext, ResponseBody } from "../../types";
import response from "../../utils/response";
import Strings from "../../config/strings";

import Admin from "../../db/models/ictcongress2024/admin";
import { PaginationOutput } from "../../types/request";
import { ErrorTypes } from "../../types/enums";

/**
 * ICT Congress Students API
 * @author mavyfaby (Maverick Fabroa)
 */
export function students(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody  {
  switch (context.request.method) {
    case "GET":
      return getStudents(context);
    case "POST":
      return postStudents(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/students
 * @param context Elysia context
 */
async function getStudents(context: ElysiaContext) {
  if (!!context.query) {
    try {
      const students = await Admin.searchStudents(context.user.campus_id, context.query as PaginationOutput);
      // console.log(students);
      return response.success(Strings.STUDENTS_FOUND, ...students);
    }

    catch (e) {
      if (e == ErrorTypes.DB_EMPTY_RESULT) {
        return response.error("No students found");
      }

      return response.error();
    }
  }

  return response.success();
}

/**
 * POST /ictcongress2024/students/:student_id/(present|confirm)
 * @param context Elysia context
 */
async function postStudents(context: ElysiaContext) {
  const isPresent = context.path.includes("present");
  const isConfirm = context.path.includes("confirm");

  const { student_id } = context.params;

  if (!student_id) {
    return response.error("Student ID is required");
  }

  // If confirming student
  if (isConfirm) {
    try {
      await Admin.confirmStudent(student_id);
      return response.success("Order successfully confirmed!");
    } catch (e) {
      return response.error(e);
    }
  }

  // If marking student as present
  if (isPresent) {
    return;
  }

  return response.success();
}