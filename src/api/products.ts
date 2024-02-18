import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";
import { ProductsColumn } from "../db/structure";

import { status501 } from "../routes";
import Strings from "../config/strings";
import Product from "../db/models/product";
import response from "../utils/response";

/**
 * Products API
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * @author mavyfaby (Maverick G. Fabroa)
 * @param context
 */
export function products(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getProducts(context);
    case "POST":
      return postProducts(context);
    case "PUT":
      return putProducts(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /products
 * @param context
 */
async function getProducts(context: ElysiaContext) {
  try {
    // If name is specified
    if (context.params?.slug) {
      const product = await Product.get(context.params.slug);
      return response.success(Strings.PRODUCT_FOUND, product);
    }
    
    // Get all products
    const products = await Product.getAll(context.query);
    return response.success(Strings.PRODUCTS_FOUND, ...products);
  }
  
  // If error
  catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.PRODUCTS_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(context.params?.slug ? Strings.PRODUCT_NOT_FOUND : Strings.PRODUCTS_NOT_FOUND);
    }
  }
}

/**
 * POST /products
 * @param context
 */
async function postProducts(context: ElysiaContext) {
  try {
    // Insert product
    await Product.insert(context.body);
    return response.success(Strings.PRODUCT_CREATED);
  }
  
  // If error
  catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.PRODUCT_POST_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 500;
      return response.error(Strings.PRODUCT_POST_ERROR);
    }
  }
}

/**
 * PUT /products
 * @param context 
 */
async function putProducts(context: ElysiaContext) {
  const { slug, key } = context.params || {};
  const { value } = context.body || {};

  if (!slug) {
    context.set.status = 400;
    return response.error(Strings.GENERAL_INVALID_REQUEST);
  }

  try {
    if (key) {
      await Product.updateKey(slug, key as ProductsColumn, value);
    } else {
      await Product.update(slug, context.body);
    }

    return response.success(Strings.PRODUCT_UPDATED);
  }
  
  // If error
  catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.PRODUCT_PUT_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.PRODUCTS_NOT_FOUND);
    }
  }
}