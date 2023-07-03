import Database from "../database";
import { ErrorTypes, DatabaseModel } from "../../types";
import type { ProductType } from "../../types/models";
import { Log } from "../../utils/log";

/**
 * Product Model
 * This model contains all the Product Information and Quantity :D
 * @author ampats04 (Jeremy Andy F. Ampatin)
*/
class Product extends DatabaseModel {
  private id: number;
  private name: string;
  private thumbnail: string;
  private short_descprition: string;
  private likes: number;
  private stock: number;
  private dateStamp?: string;

  /**
   * Product Public Constructor
   * @param data
   */
  public constructor(data: ProductType) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.short_descprition = data.short_description;
    this.likes = data.likes;
    this.stock = data.stock;
    this.dateStamp = data.dateStamp;
  }

  /**
   * Get Product list from the database 
   * @param callback 
   */
  public static getAll(callback: (error: ErrorTypes | null, product: Product[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Query the database
    db.query('SELECT * FROM products', [], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }
      
      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create Product Object
      const products: Product[] = [];
    
      // Loop through the results
      for (const data of results) {
        // Create Product Object
        const product = new Product({
          id: data.id,
          name: data.name,
          thumbnail: data.thumbnail,
          short_description: data.short_descprition,
          likes: data.likes,
          stock: data.stock,
          dateStamp: data.date_stamp
        });
        
        // Push the product object to the array
        products.push(product);
      }

      // Return the products
      callback(null, products);
    });
  }

  /**
 * Get Product list from the database using the Product ID generated
 * @param id Product ID
 */
  public static fromId(id: number, callback: (error: ErrorTypes | null, product: Product | null) => void){
    // Get database instance
    const db = Database.getInstance();
    //Query the database
    db.query("SELECT * FROM products WHERE id = ?", [id], (error,results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }
      
      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Get result
      const data = results[0];
      // Create Product Object
      const product = new Product({
        id: data.id,
        name: data.name,
        thumbnail: data.thumbnail,
        short_description: data.short_descprition,
        likes: data.likes,
        stock: data.stock,
      });

      // Return the product
      callback(null,product); // (no errors, product object)
    });
  }
}

export default Product;