import type { Request, Response } from "express";

import { result } from "../utils/response";
import { AuthType, ErrorTypes } from "../types/enums";
import { Order } from "../db/models/order";
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
  // Get order ID from request params
  const { id } = request.params;

  // If order ID is present
  if (id) {
    // Get order
    getOrder(request, response);
    return;
  }

  // If admin
  if (response.locals.role === AuthType.ADMIN) {
    // Get all orders
    Order.getAll((error, orders) => {
      // If has error
      if (error !== null) {
        // Map error
        switch (error) {
          case ErrorTypes.DB_ERROR:
            response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
            return;
          case ErrorTypes.DB_EMPTY_RESULT:
            response.status(200).send(result.error(Strings.ORDERS_EMPTY));
            return;
        }
      }

      // Otherwise, send results
      response.status(200).send(result.success(Strings.ORDERS_FOUND, orders));
    });

    return;
  }

  // Otherwise, get all orders
  Order.getAllByStudentID(response.locals.studentID, (error, orders) => {
    // If has error
    if (error !== null) {
      // Map error
      switch (error) {
        case ErrorTypes.DB_ERROR:
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        case ErrorTypes.DB_EMPTY_RESULT:
          response.status(200).send(result.error(Strings.ORDERS_EMPTY));
          return;
      }
    }

    // Otherwise, send results
    response.status(200).send(result.success(Strings.ORDERS_FOUND, orders));
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

  console.log(response.locals.studentID);

  // If has an error
  if (errors){
    response.status(400).send(result.error(errors[0], errors[1]));
    return;
  }

  // Otherwise, insert order
  Order.insert(response.locals.studentID, request.body, request.files || null, (error, receiptID) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ORDER_POST_ERROR));
      return;
    }

    // If no photo/proof
    if (error === ErrorTypes.REQUEST_FILE) {
      response.status(500).send(result.error(Strings.ORDER_EMPTY_PROOF));
      return;
    }

    // Otherwise, return the product data
    response.send(result.success(Strings.ORDER_CREATED, receiptID));
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
  Order.update(id, key, value, (error, success) => {
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

    // If not success
    if (!success) {
      response.status(400).send(result.error(Strings.ORDER_UPDATE_ERROR));
      return;
    }

    // Otherwise, return success
    response.status(200).send(result.success(Strings.ORDER_UPDATED));
  });
}