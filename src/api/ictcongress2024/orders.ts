import type { ElysiaContext, ResponseBody } from "../../types";
import { status501 } from "../../routes";
import response from "../../utils/response";
import Admin from "../../db/models/ictcongress2024/admin";

/**
 * ICT Congress Pending Orders API
 * @author mavyfaby (Maverick Fabroa)
 */
export function ictpendingorders(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getPendingOrders(context);
    case "DELETE":
      return deletePendingOrders(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /ictcongress2024/pending-orders
 * @param context Elysia context
 */
async function getPendingOrders(context: ElysiaContext) {
  try {
    const orders = await Admin.getPendingOrdersCount(context.user.campus_id);
    return response.success(orders);
  } catch (e) {
    return response.error(e);
  }
}


/**
 * DELETE /ictcongress2024/pending-orders
 * @param context Elysia context
 */
async function deletePendingOrders(context: ElysiaContext) {
  try {
    await Admin.removePendingOrders(context.user.campus_id);
    return response.success("Pending orders removed!");
  } catch (e) {
    return response.error(e);
  }
}

