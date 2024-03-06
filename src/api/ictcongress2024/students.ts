import { status501 } from "../../routes";
import { ElysiaContext, ResponseBody } from "../../types";
import response from "../../utils/response";
import Strings from "../../config/strings";

import Admin from "../../db/models/ictcongress2024/admin";
import { PaginationOutput } from "../../types/request";

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
    case "DELETE":
      return deleteStudents(context);
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
      return response.error(e);
    }
  }

  context.set.status = 400;
  return response.error("No params");
}

/**
 * POST /ictcongress2024/students/:student_id/:operation
 * @param context Elysia context
 */
async function postStudents(context: ElysiaContext) {
  // If no operation param, register student
  if (!context.params) {
    try {
      const message = await Admin.registerStudent(await context.body);
      return response.success(message);
    } catch (e) {
      console.error(e);
      return response.error(e);
    }
  }

  // Get student op
  const op = context.params["operation"];
  // Get QR code data
  const qr = context.params["qr"];

  const isUsingQR = qr !== undefined;
  const isMarkPresent = op === "mark-present";
  const isPaymentConfirm = op === "payment-confirm";
  const isClaimSnack = op === "claim-snack";
  const isClaimTshirt = op === "claim-tshirt";

  // Get student ID param
  const student_id = context.params?.student_id;
  // Get membership variable
  const isCSPSMember = context.body?.isCSPSMember;
  // Get RFID from body
  const rfid = context.body?.rfid;

  // For QR code operations
  if (isMarkPresent || isClaimSnack) {
    if (isUsingQR && !qr) return response.error("QR code is required");
  }

  // For student ID operations
  if (isPaymentConfirm || isClaimTshirt) {
    if (!student_id && !isUsingQR) return response.error("Student ID is required");
  }

  // If confirming payment for student
  if (isPaymentConfirm && student_id) {
    try {
      await Admin.confirmPaymentByStudentID(student_id!, rfid, isCSPSMember);
      return response.success("Payment successfully confirmed!");
    } catch (e) {
      return response.error(e);
    }
  }

  // If claiming t-shirt
  if (isClaimTshirt && student_id) {
    try {
      await Admin.claimTShirtByStudentID(student_id!);
      return response.success(`Student ID (${student_id}) successfully claimed t-shirt!`);
    } catch (e) {
      return response.error(e);
    }
  }

  // If marking student as present
  if (isMarkPresent && isUsingQR) {
    try {
      const student = await Admin.markStudentAsPresent({ qr });
      return response.success(`Student ID (${student.student_id}) successfully marked as present!`, student);
    } catch (e) {
      return response.error(e);
    }
  }

  // If claiming snack
  if (isClaimSnack && isUsingQR) {
    try {
      const student = await Admin.claimSnackByStudentID({ qr });
      return response.success(`Student ID (${student.student_id}) successfully claimed snack!`, student);
    } catch (e) {
      return response.error(e);
    }
  }

  // If no operation found
  return response.error("Invalid student operation!");
}

/**
 * DELETE /ictcongress2024/students/:student_id
 * @param context Elysia context
 */
async function deleteStudents(context: ElysiaContext) {
  // Get student ID param
  const student_id = context.params?.student_id;

  // If no student ID
  if (!student_id) {
    return response.error("Student ID is required");
  }

  try {
    // Remove student
    const student = await Admin.removeStudent(student_id);
    // Return success
    return response.success(`Student ${student.first_name} ${student.last_name} (${student_id}) successfully deleted!`);
  } catch (e) {
    // Return error
    return response.error(e);
  }
}