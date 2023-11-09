import { ProductModel, ProductVariationModel } from "../../types/models";
import { ErrorTypes } from "../../types/enums";
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
   * Get product by slug name
   * @param name URL friendly name of the product
   */
  public static get(slug: string) {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get product
        const product = await db.query<ProductModel[]>(`SELECT * FROM products WHERE slug = ?`, [slug]);

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

}

export default Product;