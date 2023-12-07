import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";
import { status501 } from "../routes";
import { OrdersColumn } from "../db/structure";

import Order from "../db/models/order";
import response from "../utils/response";
import Strings from "../config/strings";

/**
 * Orders API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
export function orders(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getOrders(context);
    case "POST":
      return postOrders(context);
    case "PUT":
      return putOrders(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /orders (read)
 */
async function getOrders(context: ElysiaContext) {
  // Get params
  const { reference, uniqueId } = context.params || {};

  try {
    if (context.path === "/orders" && context.user?.student_id) {
      const orders = await Order.byStudentId(context.user.student_id, context.query);
      return response.success(Strings.ORDERS_FOUND, ...orders);
    }

    if (uniqueId) {
      const order = await Order.byUniqueId(uniqueId);
      return response.success(Strings.ORDER_FOUND, order);
    }

    if (reference) {
      const order = await Order.byReference(reference);
      return response.success(Strings.ORDER_FOUND, order);
    }

    const orders = await Order.getAll(context.query);
    return response.success(Strings.ORDERS_FOUND, ...orders);
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

    if (err === ErrorTypes.DB_PRODUCT_INSUFFICIENT) {
      context.set.status = 400;
      return response.error(Strings.ORDER_ADD_INSUFFICIENT);
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

/**
 * PUT /orders (update)
 */
async function putOrders(context: ElysiaContext) {
  // Get params
  const { id, key } = context.params || {};

  // Check if params are valid
  if (!id || !key) {
    context.set.status = 400;
    return response.error(Strings.ORDER_UPDATE_ERROR);
  }

  try {
    // Update order
    const order = await Order.update(Number(id), key as OrdersColumn, context.body.value);
    return response.success(Strings.ORDER_UPDATED, order);
  }

  catch (err) {
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ORDER_UPDATE_ERROR);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ORDER_NOT_FOUND);
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

    if (err === ErrorTypes.DB_PRODUCT_INSUFFICIENT) {
      context.set.status = 400;
      return response.error(Strings.ORDER_ADD_INSUFFICIENT);
    }

    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }
  }
}
