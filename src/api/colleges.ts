import { ElysiaContext, ResponseBody } from "../types";

import { status501 } from "../routes";
import response from "../utils/response";
import College from "../db/models/college";

/**
 * Colleges API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
export function colleges(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getColleges(context);
  }

  return status501(context);
}

/**
 * GET /colleges
 * @param context 
 */
function getColleges(context: ElysiaContext): Promise<ResponseBody> {
  return new Promise(async (resolve) => {
    try {
      if (context.params?.acronym) {
        // Get college by acronym
        const college = await College.getByAcronym(context.params.acronym);
        // Return the college
        return resolve(response.success("College retrieved!", college));
      }

      // Get all colleges
      const colleges = await College.getAll();
      // Return the colleges
      resolve(response.success("Colleges retrieved!", colleges));
    }

    // Log error and reject promise
    catch (e) {
      resolve(response.error(e));
    }
  });
}
