import type { Request, Response } from "express";
import { Session } from "../classes/session";
import { result } from "../utils/response";
import { ErrorTypes, Strings } from "../types/enums";
import { Order } from "../db/models/order";

/**
 * Orders API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function orders(request: Request, response: Response) {
  // Get student ID from JWT session
  Session.getStudentID(request, (studentID) => {
    // If student ID is null
    if (studentID === null) {
      response.status(401).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    // Set student ID to response locals
    response.locals.studentID = studentID;

    // Otherwise, map request method
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
  });
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
}

/**
 * POST /orders
 */
export function postOrders(request: Request, response: Response) {

}

/**
 * PUT /orders/:id/:key 
 */
export function putOrders(request: Request, response: Response) {
  
}