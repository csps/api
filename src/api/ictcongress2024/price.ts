import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";

import Admin from "../../db/models/ictcongress2024/admin";
import { ErrorTypes } from "../../types/enums";

/**
 * ICT Congress Price API
 * @author mavyfaby (Maverick Fabroa)
 */
export function ictprice(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getPrice(context);
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/price/:discount_code
 * @param context Elysia context
 */
async function getPrice(context: ElysiaContext) {
  try {
    // Get param
    const discount_code = context.params["discount_code"];

    // If no discount code provided
    if (!discount_code) {
      return response.error("No discount code provided");
    }

    // Get price
    const price = await Admin.getPrice(discount_code);
    return response.success("Price retrieved.", price);
  }

  // Log error and return error response
  catch (e) {
    if (e === ErrorTypes.DB_ERROR) {
      return response.error("Error retrieving config.");
    }

    return response.error(e);
  }
}

