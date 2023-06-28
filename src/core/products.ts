import { Response } from 'express';
import { ErrorTypes } from '../types';
import { result } from '../utils/response';
import Product from '../db/models/product';

/**
 * Products API
 * getAllProducts Feature || ROUTE: GET
 * @author ampats04 (Jeremy Andy F. Ampatin)
 */
export function products(request: any, response: Response) {
  switch (request.method) {
    case 'GET':
      getProducts(request, response);
      break;
  }
}

/**
 * GET /products
 * @param request Express Request Object
 * @param response Express Response Object
 */
function getProducts(request: Request, response: Response) {
  // Get all products
  Product.getAll((error, products) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting products from database"));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("No products found"));
      return;
    }
    
    // Return the products
    response.send(result.success("Products found!", products));
  });
}

