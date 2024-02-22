import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";

import Admin from "../../db/models/ictcongress2024/admin";
import { setHeader } from "../../utils/security";

/**
 * ICT Congress Export API
 * @author mavyfaby (Maverick Fabroa)
 */
export function ictexport(context: ElysiaContext): Promise<ResponseBody | undefined | File> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getExport(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/export/(csv|xlsx)
 * @param context Elysia context
 */
async function getExport(context: ElysiaContext) {
  try {
    // Get sheet with campus ID
    const sheet = await Admin.exportToSheets(context.user.campus_id);
    // Set content type
    setHeader(context, 'content-type', sheet.type);
    setHeader(context, 'content-disposition', `attachment; filename="${sheet.name}"`);
    // Export sheet
    return sheet;
  }

  // Log error and return error response
  catch (e) {
    // Set content type
    setHeader(context, 'content-type', "application/json");
    // Return error
    return response.error(e);
  }
}

