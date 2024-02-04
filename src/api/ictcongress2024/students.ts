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