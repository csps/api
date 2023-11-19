import { ProductModel, ProductVariationModel } from "../../types/models";
import { ErrorTypes } from "../../types/enums";
import Log from "../../utils/log";
import Database from "..";
import { MariaUpdateResult } from "../../types";

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
  public static getAll(): Promise<ProductModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all products
        const products = await db.query<ProductModel[]>(`SELECT * FROM products ORDER BY name ASC`);

        // If no results
        if (products.length === 0) {
          Log.e("No products found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Get all product variations
        const variations = await db.query<ProductVariationModel[]>(
          `SELECT pv.id, pv.products_id, pv.variations_id, pv.photos_hash, v.name FROM product_variations pv INNER JOIN variations v ON pv.variations_id = v.id
        `);

        // If no results, resolve without variations
        if (variations.length === 0) {
          Log.i("[All] No product variations found");
          return resolve(products);
        }

        // Map product variations to products
        for (const product of products) {
          product.variations = variations.filter(v => v.products_id === product.id);
        }

        // Resolve promise
        resolve(products);
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
   * Update product stock
   * @param id if string, it's a slug name, product id otherwise
   * @param change change in stock (positive or negative)
   */
  public static updateStock(id: string | number, change: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();
      // Is using slug name
      const isSlug = typeof id === 'string';

      try {
        // Update stock
        const result = await db.query<MariaUpdateResult>(`UPDATE products SET stock = stock + ? WHERE ${isSlug ? 'slug' : 'id'} = ?`, [change, id]);

        // If no results
        if (result.affectedRows === 0) {
          Log.e("Update stock failed: No product found");
          return reject(ErrorTypes.DB_ERROR);
        }

        // Log message
        Log.i(`Product '${id}' stock ${change > 0 ? 'in' : 'de'}cremented by ${Math.abs(change)}`);
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
}

export default Product;