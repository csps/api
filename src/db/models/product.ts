import Database from "../database";
import { ErrorTypes, DatabaseModel } from "../../types";
import type { ProductType } from "../../types/models";
import { Log } from "../../utils/log";
import { isNumber, isUrl } from "../../utils/string";
import { getDatestamp } from "../../utils/date";

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


  /**
   * Validate Product Data
   * @param data Product Data
   */

  public static validate(data: any){
    //check if name is empty
    if (!data.name) return ["Name is required!", "name"];
    //check if thumbnail is empty
    if (data.thumbnail.trim().length === 0) return ["Thumbnail is required!", "thumbnail"];
    //check if Short Description is empty
    if (!data.short_descprition) return ["Short Description is required!", "short_description"];
    //Check if Short Description doesn't exceed 255 characters
    if (data.short_descprition.length > 255) return ["Short Description must not exceed 255 characters!", "short_description"];
    //Check if Likes is not less than 0
    if (data.likes.length < 0 ) return ["Likes must not be below 0", "likes"];
    //Check if stocks is not less than 0
    if (data.stock.length < 0) return ["Stocks must not be below 0", "stock"];
    //Check if thumbnail URL format is correct 
    if (!isUrl(data.thumbnail)) return ["Invalid thumbnail URL format", "thumbnail"];
  }

  /**
   * Insert product data to the database
   * @param product Product Data
   * @param callback Callback Function
   */

  public static insert(product: ProductType, callback: (error: ErrorTypes | null, product: Product | null) => void) {

    // Get database instance
    const db = Database.getInstance();
    
    // Get the current date
    const datestamp = getDatestamp();

    //Query the Database

    db.query("INSERT INTO products (name, thumbnail, short_description, likes, stocks, date_stamp) VALUES (?,?,?,?,?,?)", [
      product.name,
      product.thumbnail,
      product.short_description,
      product.likes,
      product.stock,
      datestamp
    ], (error, results) => {
      // If has an error
      if (error) {
        console.log(error);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Set the primary key ID
      product.id = results.insertId;
      // Set the date stamp
      product.dateStamp = datestamp;

      // Return the student
      callback(null, new Product(product));

    });
    
  }
  
  /**
   * Get primary key ID
   */

  public getId(){
    return this.id || -1;
  }

  /**
   * Get name
   */

  public getName(){
    return this.name;
  }

  /**
   * Get Thumbnail 
   */

  public getThumbnail(){
    return this.thumbnail;
  }

  /**
   * Get Short Description
   */

  public getShortDescription(){
    return this.short_descprition;
  }

  /**
   * Get Likes
   */

  public getLikes(){
    return this.likes;
  }

  /**
   * Get Stock
   */

  public getStock(){
    return this.stock;
  }

  
}

export default Product;