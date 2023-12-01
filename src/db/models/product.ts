import { ProductModel, ProductVariationModel } from "../../types/models";
import { ErrorTypes } from "../../types/enums";
import { MariaUpdateResult } from "../../types";
import { ProductsColumn } from "../structure.d";
import { PaginationOutput } from "../../types/request";
import { isObjectEmpty } from "../../utils/string";
import { paginationWrapper } from "../../utils/pagination";

import Log from "../../utils/log";
import Database from "..";

/**
 * Product Model
 * This model contains all the Product Information and Quantity :D
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * @author mavyfaby (Maverick Fabroa)
*/
class Product {

  /**
   * Get all products
   */
  public static getAll(pagination?: PaginationOutput): Promise<[ ProductModel[], count: number ]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Queries
        const queryProducts = "SELECT * FROM products ORDER BY name ASC";
        const queryVariants = "SELECT pv.id, pv.products_id, pv.variations_id, pv.photos_hash, v.name FROM product_variations pv INNER JOIN variations v ON pv.variations_id = v.id";

        // Get pagination
        if (pagination && !isObjectEmpty(pagination)) {
          const { query, countQuery, values, countValues } = paginationWrapper(db, {
            query: queryProducts,
            request: pagination
          });

          const mainResult = await db.query<ProductModel[]>(query, values);
          const countResult = await db.query<[{ count: bigint }]>(countQuery, countValues);

          // If no results
          if (mainResult.length === 0) {
            Log.e("No products found");
            return reject(ErrorTypes.DB_EMPTY_RESULT);
          }
          
          return resolve([ await getProductWithVariations(mainResult), Number(countResult[0].count) ]);
        }
        
        // Get all products
        const products = await db.query<ProductModel[]>(queryProducts);

        // If no results
        if (products.length === 0) {
          Log.e("No products found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Get product with variations
        async function getProductWithVariations(products: ProductModel[]) {
          // Get all product variations
          const variations = await db.query<ProductVariationModel[]>(queryVariants);
  
          // If no results, resolve without variations
          if (variations.length === 0) {
            Log.i("[All] No product variations found");
          }
  
          // Map product variations to products
          for (const product of products) {
            product.variations = variations.filter(v => v.products_id === product.id);
          }

          return products;
        }

        // Resolve promise
        resolve([ await getProductWithVariations(products), products.length ]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Get product by slug name or id
   * @param id if string, it's a slug name, product id otherwise
   */
  public static get(id: string | number): Promise<ProductModel> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();
      // Is using slug name
      const isSlug = typeof id === 'string';

      try {
        // Get product
        const product = await db.query<ProductModel[]>(`SELECT * FROM products WHERE ${isSlug ? 'slug' : 'id'} = ?`, [id]);

        // If no results
        if (product.length === 0) {
          Log.e("No product found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Get product variations
        const variations = await db.query<ProductVariationModel[]>(
          `SELECT pv.id, pv.products_id, pv.variations_id, pv.photos_hash, v.name FROM product_variations pv INNER JOIN variations v ON pv.variations_id = v.id WHERE pv.products_id = ?
        `, [product[0].id]);

        // If no results, resolve without variations
        if (variations.length === 0) {
          Log.i(`No product variations found for ${product[0].name}`);
          return resolve(product[0]);
        }

        // Map product variations to product
        product[0].variations = variations;
        // Resolve promise
        resolve(product[0]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Update product by key
   */
  public static updateKey(id: string | number, key: ProductsColumn, value: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();
      // Is using slug name
      const isSlug = typeof id === 'string';

      try {
        // Update product
        const result = await db.query<MariaUpdateResult>(`UPDATE products SET ${db.escapeId(key)} = ? WHERE ${isSlug ? 'slug' : 'id'} = ?`, [value, id]);

        // If no results
        if (result.affectedRows === 0) {
          Log.e("Update product failed: No product found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Log message
        Log.i(`[PRODUCT] Updated product ${id} - ${key} to ${value}.`);
        // Resolve promise
        resolve();
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Update product stock
   * @param id if string, it's a slug name, product id otherwise
   * @param delta change in stock (positive or negative)
   */
  public static updateStock(id: string | number, delta: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();
      // Is using slug name
      const isSlug = typeof id === 'string';

      try {
        // Get current stock
        const stocks = await db.query<{ stock: number }[]>(`SELECT stock FROM products WHERE ${isSlug ? 'slug' : 'id'} = ?`, [id]);

        // If no results
        if (stocks.length === 0) {
          Log.e("[Product.updateStock]: No product found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // If stock is lesser than delta
        if (stocks[0].stock + delta < 0) {
          Log.e("[Product.updateStock]: Insufficient stock");
          return reject(ErrorTypes.DB_PRODUCT_INSUFFICIENT);
        }

        // Update stock
        const result = await db.query<MariaUpdateResult>(`UPDATE products SET stock = stock + ? WHERE ${isSlug ? 'slug' : 'id'} = ?`, [delta, id]);

        // If no results
        if (result.affectedRows === 0) {
          Log.e("Update stock failed: No product found");
          return reject(ErrorTypes.DB_ERROR);
        }

        // Log message
        Log.i(`[ORDER] ${delta >= 0 ? 'Incrementing' : 'Decrementing'} product #'${id}' stock by ${Math.abs(delta)}.`, true);
        // Resolve promise
        resolve();
      }
      
      // Log error and reject promise
      catch (e) {
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
}

export default Product;