import type { Response, Request } from "express"
import { ErrorTypes } from "../types";
import { isNumber } from "../utils/string";
import { result } from "../utils/response";
import Product from "../db/models/product";

/**
 * Product API
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

/**
 * GET /products/:id
 * @param request Express Request Object
 * @param response Express Response Object
 */
function getProduct(request: Request, response: Response) {
  // Get the product ID
  const { id } = request.params;

  // If id is not a number, return student not found
  if (!isNumber(id)) {
    response.status(404).send(result.error("Student not found!"));
    return;
  }

  // Get the product by its ID
  Product.fromId(parseInt(id), (error, product) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting product from database."));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("Product not found."));
    }

    // Return the product
    response.send(result.success("Product found!", product));
  });

}

function postProduct(request: Request, response: Response) {

}

function putProduct(request: Request, response: Response) {

}

function deleteProduct(request: Request, response: Response) {

}


