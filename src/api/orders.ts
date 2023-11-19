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
    case "POST":
      return postOrders(context);
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

/**
 * POST /orders (create)
 */
async function postOrders(context: ElysiaContext) {
  try {
    // Create order
    const order = await Order.insert(context);
    return response.success(Strings.ORDER_CREATED, order);
  }

  catch (err) {
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ORDER_POST_ERROR);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.PRODUCT_NOT_FOUND);
    }

    if (err === ErrorTypes.UNAVAILABLE) {
      context.set.status = 404;
      return response.error(Strings.ORDER_UNAVAILABLE);
    }

    if (err === ErrorTypes.DB_PRODUCT_NO_STOCK) {
      context.set.status = 404;
      return response.error(Strings.ORDER_ADD_NO_STOCK);
    }

    if (err === ErrorTypes.REQUEST_FILE) {
      context.set.status = 404;
      return response.error(Strings.ORDER_EMPTY_PROOF);
    }

    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }
  }
}

export default orders;