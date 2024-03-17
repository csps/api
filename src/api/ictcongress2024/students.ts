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
 * GET /ictcongress2024/students/(:uid?)
 * @param context Elysia context
 */
async function getStudents(context: ElysiaContext) {
  // If getting student by UID
  if (context.params?.uid) {
    try {
      const student = await Admin.getStudentByUID(Number(context.params.uid));
      return response.success(Strings.STUDENT_FOUND, student);
    } catch (e) {
      context.set.status = 400;
      return response.error(e);
    }
  }

  // If has query
  if (Object.keys(context.query).length > 0) {
    try {
      const students = await Admin.searchStudents(context.user.campus_id, context.query as PaginationOutput);
      return response.success(Strings.STUDENTS_FOUND, { students: students.students, tshirt_sizes: students.tshirt_sizes }, students.count);
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

  // Get student UID param
  const uid = context.params?.uid;
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
    if (!uid && !isUsingQR) return response.error("Student UID is required");
  }

  // If confirming payment for student
  if (isPaymentConfirm && uid) {
    try {
      await Admin.confirmPaymentByUID(Number(uid), rfid, isCSPSMember);
      return response.success("Payment successfully confirmed!");
    } catch (e) {
      return response.error(e);
    }
  }

  // If claiming t-shirt
  if (isClaimTshirt && uid) {
    try {
      const student = await Admin.claimTShirtByUID(Number(uid));
      return response.success(`Student ID (${student.first_name} ${student.last_name}) successfully claimed t-shirt!`);
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
      const student = await Admin.claimSnack({ qr });
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
  // Get student UID param
  const uid = context.params?.uid;

  // If no student UID
  if (!uid) {
    return response.error("Student UID is required");
  }

  try {
    // Remove student
    const student = await Admin.removeStudent(Number(uid));
    // Return success
    return response.success(`Student ${student.first_name} ${student.last_name} (${student.student_id}) successfully deleted!`);
  } catch (e) {
    // Return error
    return response.error(e);
  }
}