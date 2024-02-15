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
  // If has query
  if (Object.keys(context.query).length > 0) {
    try {
      const students = await Admin.searchStudents(context.user.campus_id, context.query as PaginationOutput);
      return response.success(Strings.STUDENTS_FOUND, ...students);
    }

    catch (e) {
      if (e == ErrorTypes.DB_EMPTY_RESULT) {
        return response.error("No students found");
      }

      return response.error();
    }
  }

  context.set.status = 400;
  return response.error("No params");
}

/**
 * POST /ictcongress2024/students/:student_id/(present|payment-confirm)
 * @param context Elysia context
 */
async function postStudents(context: ElysiaContext) {
  const isMarkPresent = context.path.includes("mark-present");
  const isPaymentConfirm = context.path.includes("payment-confirm");
  const isClaimSnack = context.path.includes("claim-snack");
  const isClaimTshirt = context.path.includes("claim-tshirt");
  const student_id = context.params?.student_id;

  // Check for student ID
  if (!student_id && (isMarkPresent || isPaymentConfirm || isClaimSnack)) {
    return response.error("Student ID is required");
  }

  // If confirming payment for student
  if (isPaymentConfirm) {
    try {
      await Admin.confirmPaymentByStudentID(student_id!);
      return response.success("Payment successfully confirmed!");
    } catch (e) {
      return response.error(e);
    }
  }

  // If marking student as present
  if (isMarkPresent) {
    try {
      await Admin.markStudentAsPresent(student_id!);
      return response.success(`Student ID (${student_id}) successfully marked as present!`);
    } catch (e) {
      return response.error(e);
    }
  }

  // If claiming snack
  if (isClaimSnack) {
    try {
      await Admin.claimSnackByStudentID(student_id!);
      return response.success(`Student ID (${student_id}) successfully claimed snack!`);
    } catch (e) {
      return response.error(e);
    }
  }

  // If claiming t-shirt
  if (isClaimTshirt) {
    try {
      await Admin.claimTShirtByStudentID(student_id!);
      return response.success(`Student ID (${student_id}) successfully claimed t-shirt!`);
    } catch (e) {
      return response.error(e);
    }
  }

  // Register student
  try {
    await Admin.registerStudent(await context.body);
    return response.success("You have successfully registered! 💛"); // TODO: Add more info
  } catch (e) {
    console.error(e);
    return response.error(e);
  }
}