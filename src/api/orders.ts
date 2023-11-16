import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";
import { status501 } from "../routes";

import Order from "../db/models/order";
import response from "../utils/response";
import Strings from "../config/strings";

/**
 * Orders API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function orders(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getOrders(context);
  }

  return status501(context);
}

/**
 * GET /orders (read)
 */
async function getOrders(context: ElysiaContext) {
  try {
    const orders = await Order.getAll();
    return response.success(Strings.ORDERS_FOUND, orders);
  }

  catch (err) {
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ORDERS_EMPTY);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ORDERS_EMPTY);
    }
  }
}

export default orders;