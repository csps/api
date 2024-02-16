import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";
import Admin from "../../db/models/ictcongress2024/admin";

/**
 * ICT Congress RFID API
 * @author mavyfaby (Maverick Fabroa)
 */
export function ictrfid(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "POST":
      return postRFID(context);
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/rfid/:rfid
 * @param context Elysia context
 */
async function postRFID(context: ElysiaContext) {
  try {
    // Get param
    const rfid = context.params["rfid"];

    // If no rfid provided
    if (!rfid) {
      return response.error("No rfid provided");
    }

    // Get student
    const student = await Admin.getStudentByRFID(rfid);
    // Mark student as present
    await Admin.markStudentAsPresent(student.student_id);
    // Return success response
    return response.success(`Welcome, ${student.first_name} ${student.last_name}`, student);
  }

  // Log error and return error response
  catch (e) {
    return response.error(e);
  }
}

