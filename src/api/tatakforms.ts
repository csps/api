import type { ElysiaContext, ResponseBody } from "../types";
import response from "../utils/response";
import Tatakform from "../db/models/tatakform";
import { status501 } from "../routes";

/**
 * Tatakforms API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
export function tatakforms(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getTatakforms(context);
  }

  return status501(context);
}

/**
 * GET /tatakforms (read)
 */
async function getTatakforms(context: ElysiaContext) {
  // Get all tatakforms
  try {
    const tatakforms = await Tatakform.getAll();
    return response.success("Tatakforms found!", tatakforms);
  } catch (err) {
    return response.error(err);
  }
}
