import { Request, Response } from 'express';
import { ErrorTypes } from '../types/enums';
import { result } from '../utils/response';
import { isNumber } from '../utils/string';
import Product from '../db/models/product';

import {
  PRODUCTS_GET_ERROR, PRODUCTS_NOT_FOUND, PRODUCTS_FOUND,
  PRODUCT_GET_ERROR, PRODUCT_NOT_FOUND, PRODUCT_FOUND,
  PRODUCT_POST_ERROR, PRODUCT_ALREADY_EXIST, PRODUCT_CREATED
} from "../strings/strings.json";

/**
 * Products API
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * 
 * @param request Exprese request
 * @param response Express response
 */
export function products(request: any, response: Response) {
  switch (request.method) {
    case 'GET':
      getProducts(request, response);
      break;
    case 'POST':
      postProducts(request, response);
      break;
  }
}

/**
 * GET /products
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
function getProducts(request: Request, response: Response) {
  // Get {id} from request parameters
  const { id } = request.params;

  // If has an id, call `getProduct` function instead
  if (id) {
    getProduct(request, response);
    return;
  }

  // Get all products
  Product.getAll((error, products) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(PRODUCTS_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(PRODUCTS_NOT_FOUND));
      return;
    }
    
    // Return the products
    response.send(result.success(PRODUCTS_FOUND, products));
  });
}

/**
 * GET /products/:id
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
function getProduct(request: Request, response: Response) {
  // Get the product ID
  const { id } = request.params;

  // If id is not a number, return student not found
  if (!isNumber(id)) {
    response.status(404).send(result.error(PRODUCT_NOT_FOUND));
    return;
  }

  // Get the product by its ID
  Product.fromId(parseInt(id), (error, product) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(PRODUCT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(PRODUCT_NOT_FOUND));
      return;
    }

    // Return the product
    response.send(result.success(PRODUCT_FOUND, product));
  });
}

/**
 * POST /products
 * 
 * @param request 
 * @param response 
 */
function postProducts(request: Request, response: Response){
  // Validate the product data
  const validation = Product.validate(request.body);

  // If has an error
  if (validation){
    response.status(400).send(result.error(validation[0], validation[1]));
    return;
  }

  // Insert the student to the database
  Product.insert(request.body, (error, product) => {
    // If has an error
    switch(error){
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(PRODUCT_POST_ERROR));
        break;
      case ErrorTypes.DB_PRODUCT_ALREADY_EXISTS:
        response.status(400).send(result.error(PRODUCT_ALREADY_EXIST));
      break;
    }

    // Otherwise, return the product data
    response.send(result.success(PRODUCT_CREATED, product));
  });

}

