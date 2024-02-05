import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";

import Admin from "../../db/models/ictcongress2024/admin";
import { ErrorTypes } from "../../types/enums";

/**
 * ICT Congress Config API
 * @author mavyfaby (Maverick Fabroa)
 */
export function index(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getConfig(context);
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/config
 * @param context Elysia context
 */
async function getConfig(context: ElysiaContext) {
  try {
    // Get config
    const campuses = await Admin.getCampuses();
    const courses = await Admin.getCourses();
    const tshirt_sizes = await Admin.getTShirtSizes();

    return response.success("Config retrieved.", { campuses, courses, tshirt_sizes });
  }

  // Log error and return error response
  catch (e) {
    if (e === ErrorTypes.DB_ERROR) {
      return response.error("Error retrieving config.");
    }

    return response.error(e);
  }
}

