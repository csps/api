import { ErrorTypes } from "../types/enums";
import type { ElysiaContext, ResponseBody } from "../types";

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
function products(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getProducts(context);
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
    const products = await Product.getAll();
    return response.success(Strings.PRODUCTS_FOUND, products);
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
      return response.error(Strings.PRODUCTS_NOT_FOUND);
    }
  }
}

export default products;