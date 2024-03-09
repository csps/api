import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";
import Admin from "../../db/models/ictcongress2024/admin";

/**
 * ICT Congress Statistics API
 * @author mavyfaby (Maverick Fabroa)
 */
export function ictstatistics(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getStatistics(context);
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/statistics
 * @param context Elysia context
 */
async function getStatistics(context: ElysiaContext) {
  try {
    // Get statistics
    const statistics = await Admin.getStatistics(context.user.campus_id);
    // Return success response
    return response.success("Statistics retrieved", statistics);
  }

  // Log error and return error response
  catch (e) {
    return response.error(e);
  }
}

