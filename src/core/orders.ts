import type { Request, Response } from "express";

import { result } from "../utils/response";
import { AuthType, ErrorTypes, OrderStatus } from "../types/enums";
import { Order } from "../db/models/order";
import { OrderColumns } from "../db/structure";
import { isObjectEmpty } from "../utils/string";
import Strings from "../config/strings";

/**
 * Orders API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function orders(request: Request, response: Response) {
  // Map request method
  switch (request.method) {
    case 'GET':
      getOrders(request, response);
      break;
    case 'POST':
      postOrders(request, response);
      break;
    case 'PUT':
      putOrders(request, response);
      break;
  }
}

/**
 * GET /orders
 */
export function getOrders(request: Request, response: Response) {
  // Get request data from request params
  const { id, reference, studentId, uniqueId } = request.params;

  // If order ID is present
  if (id) {
    getOrder(request, response);
    return;
  }

  // If using reference and is admin
  if (reference && response.locals.role === AuthType.ADMIN) {
    // Find order
    Order.find({
      search_column: `["${OrderColumns.REFERENCE}"]`,
      search_value: `["${reference}"]`,
    }, (error, orders, count) => {
        if (error === ErrorTypes.DB_ERROR) {
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        }

        if (error === ErrorTypes.DB_EMPTY_RESULT) {
          response.status(404).send(result.error(Strings.ORDER_NOT_FOUND));
          return;
        }

        response.status(200).send(result.success(Strings.ORDER_FOUND, orders ? orders[0] : null));
    });

    return;
  }

  // If unique ID is present
  if (uniqueId) {
    // Find order by unique ID
    Order.find({
      search_column: `["${OrderColumns.UNIQUE_ID}"]`,
      search_value: `["${uniqueId}"]`,
    }, (error, orders, count) => {
        if (error === ErrorTypes.DB_ERROR) {
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        }

        if (error === ErrorTypes.DB_EMPTY_RESULT) {
          response.status(404).send(result.error(Strings.ORDER_NOT_FOUND));
          return;
        }

        response.status(200).send(result.success(Strings.ORDER_FOUND, orders ? orders[0] : null));    
    });

    return;
  }

  // If using reference and student ID is present
  if (reference && studentId) {
    // Find order
    Order.find({
      search_column: `["${OrderColumns.REFERENCE}", "${OrderColumns.STUDENT_ID}"]`,
      search_value: `["${reference}", "${studentId}"]`,
    }, (error, orders, count) => {
        if (error === ErrorTypes.DB_ERROR) {
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        }

        if (error === ErrorTypes.DB_EMPTY_RESULT) {
          response.status(404).send(result.error(Strings.ORDER_NOT_FOUND));
          return;
        }

        response.status(200).send(result.success(Strings.ORDER_FOUND, orders ? orders[0] : null));
    });

    return;
  }

  // If auth type is student
  if (response.locals.role === AuthType.STUDENT) {
    // Get student ID from response locals
    const { studentID } = response.locals;

    // If student ID is not present
    if (!studentID) {
      // Return error
      response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
      return;
    }

    const cols = JSON.parse(request.query.search_column as string);
    const vals = JSON.parse(request.query.search_value as string);

    // add student ID to cols
    cols.unshift('*student_id');
    // add student ID to vals
    vals.unshift(studentID);

    // Set search column and value
    request.query.search_column = JSON.stringify(cols);
    request.query.search_value = JSON.stringify(vals);
  }

  // Get all orders
  Order.find(request.query, (error, orders, count) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(200).send(result.error(Strings.ORDERS_EMPTY));
      return;
    }

    if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED) {
      response.status(400).send(result.error(Strings.GENERAL_COLUMN_NOT_FOUND));
      return;
    }

    response.status(200).send(result.success(Strings.ORDERS_FOUND, orders, count));
  });
}

/**
 * GET /orders/:id 
 */
export function getOrder(request: Request, response: Response) {
  // Get order ID from request params
  const { id } = request.params;

  // If order ID is not present
  if (!id) {
    // Return error
    response.status(400).send(result.error(Strings.ORDER_INVALID_ID));
    return;
  }

  // Otherwise, get order
  Order.fromId(id, (error, order) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ORDER_NOT_FOUND));
      return;
    }

    // Otherwise, send order
    response.status(200).send(result.success(Strings.ORDER_FOUND, order));
  });
}

/**
 * POST /orders
 */
export function postOrders(request: Request, response: Response) {
  // Is logged in?
  const isLoggedIn = !!response.locals.studentID;
  // Validate order data
  const errors = Order.validate(request.body, isLoggedIn, request.files);

  // If has an error
  if (errors){
    response.status(400).send(result.error(errors[0], errors[1]));
    return;
  }

  // Otherwise, insert order
  Order.insert(response.locals.studentID, request.body, request.files || null, (error, uniqueId) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ORDER_POST_ERROR));
      return;
    }

    // If ordering an unavailable product
    if (error === ErrorTypes.UNAVAILABLE) {
      response.status(500).send(result.error(Strings.ORDER_UNAVAILABLE));
      return;
    }

    // If no photo/proof
    if (error === ErrorTypes.REQUEST_FILE) {
      response.status(500).send(result.error(Strings.ORDER_EMPTY_PROOF));
      return;
    }

    // If product is out of stock
    if (error === ErrorTypes.DB_PRODUCT_NO_STOCK) {
      response.status(400).send(result.error(Strings.ORDER_ADD_NO_STOCK));
      return;
    }

    // Send email
    Order.sendEmail(uniqueId!);
    // Otherwise, return the product data
    response.send(result.success(Strings.ORDER_CREATED, uniqueId));
  });
}

/**
 * PUT /orders/:id/:key 
 */
export function putOrders(request: Request, response: Response) {
  // Get order ID from request params
  const { id, key } = request.params;
  // Get value from request body
  const { value } = request.body;

  // If request body and value is empty
  if (isObjectEmpty(request.body) || !request.body.value) {
    // Return error
    response.status(400).send(result.error(Strings.GENERAL_INVALID_REQUEST));
    return;
  }

  // Update order
  Order.update(id, key, value, (error, dateStamp) => {
    // IF has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // if id is empty
    if (error === ErrorTypes.REQUEST_ID) {
      response.status(400).send(result.error(Strings.ORDER_INVALID_ID));
      return;
    }

    // if key is empty
    if (error === ErrorTypes.REQUEST_KEY) {
      response.status(400).send(result.error(Strings.ORDER_INVALID_KEY));
      return;
    }

    // if key is not allowed
    if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED) {
      response.status(400).send(result.error(Strings.GENERAL_KEY_NOT_ALLOWED));
      return;
    }

    // If order not found
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ORDER_NOT_FOUND));
      return;
    }

    // If product is out of stock
    if (error === ErrorTypes.DB_PRODUCT_NO_STOCK) {
      response.status(400).send(result.error(Strings.ORDER_UPDATE_STATUS_NO_STOCK));
      return;
    }

    // If not success
    if (!dateStamp) {
      response.status(400).send(result.error(Strings.ORDER_UPDATE_ERROR));
      return;
    }

    // If status is completed
    if (key === OrderColumns.STATUS && value == OrderStatus.COMPLETED) {
      // Send email
      Order.sendEmail(id, true);
    }

    // Otherwise, return success
    response.status(200).send(result.success(Strings.ORDER_UPDATED, dateStamp));
  });
}