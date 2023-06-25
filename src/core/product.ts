
import type { Response, Request } from "express"
import { result } from "../utils/response";
import Product from "../db/models/product";
import { ErrorTypes } from "../types";

/**
 * HTTP Requests
 * This contains all the Request made by the Product API
 * @author ampats04 (Jeremy Andy F. Ampatin)
 */
export function product(request: Request, response: Response) {
  switch (request.method) {
    case 'GET':
      getProduct(request, response);
      break;
    case 'POST':
      postProduct(request, response);
      break;
    case 'PUT':
      putProduct(request, response);
      break;
    case 'DELETE':
      deleteProduct(request, response);
      break;

  }
}

export function getProduct(request: Request, response: Response) {
  const productId = request.params.id;

  Product.fromId(Number(productId), (error, product) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Internal Server Error"));
    } else if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).json(result.error("Product not found"));
    } else {
      response.send(result.success(product));
    }
  });

}

export function postProduct(request: Request, response: Response) {

}

export function putProduct(request: Request, response: Response) {

}

export function deleteProduct(request: Request, response: Response) {

}


