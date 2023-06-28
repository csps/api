import Database from "../database";
import { ErrorTypes, DatabaseModel } from "../../types";

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


  /**
   * Product Public Constructor
   * @param id Product ID
   * @param name Product Name
   * @param thumbnail Product URL Thumbnail
   * @param short_description Product Short Description
   * @param likes Product Popularity
   * @param stock Product Stocks
   */
  public constructor(
    id: number,
    name: string,
    thumbnail: string,
    short_description: string,
    likes: number,
    stock: number
  ) {
    super();
    this.id = id;
    this.name = name;
    this.thumbnail = thumbnail;
    this.short_descprition = short_description;
    this.likes = likes;
    this.stock = stock;
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
        console.log(error);
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
        const product = new Product(
          data.id,
          data.name,
          data.thumbnail,
          data.short_descprition,
          data.likes,
          data.stock,
        );
        
        // Push the product object to the array
        products.push(product);
      }

      // Return the products
      callback(null, products);
    });
  }
}

export default Product;