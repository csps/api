import { Log } from "../../utils/log";
import { ErrorTypes } from "../../types/enums";
import Database, { DatabaseModel } from "../database";
import { isNumber } from "../../utils/string";
import { getDatestamp } from "../../utils/date";
import type { ProductType, ProductVariation } from "../../types/models";

import {
  PRODUCT_EMPTY_NAME, PRODUCT_EMPTY_SHORT_DESCRIPTION, PRODUCT_EMPTY_DESCRIPTION,
  PRODUCT_EMPTY_PRICE, PRODUCT_EMPTY_STOCK, PRODUCT_EMPTY_THUMBNAIL,
  PRODUCT_LIMIT_SHORT_DESCRIPTION, PRODUCT_LIMIT_PRICE, PRODUCT_LIMIT_STOCK,
  PRODUCT_INVALID_PRICE, PRODUCT_INVALID_STOCK, PRODUCT_INVALID_THUMBNAIL,
} from "../../strings/strings.json";

/**
 * Product Model
 * This model contains all the Product Information and Quantity :D
 * @author ampats04 (Jeremy Andy F. Ampatin)
*/
class Product extends DatabaseModel {
  private id: number;
  private name: string;
  private thumbnail: number;
  private short_description: string;
  private description: string;
  private likes: number;
  private stock: number;
  private price: number;
  private dateStamp?: string;
  private variations: ProductVariation[];

  /**
   * Product Public Constructor
   * @param data
   */
  public constructor(data: ProductType) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.short_description = data.short_description;
    this.description = data.description;
    this.likes = data.likes;
    this.stock = data.stock;
    this.price = data.price;
    this.dateStamp = data.dateStamp;
    this.variations = data.variations || [];
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
          short_description: data.short_description,
          description: data.description,
          likes: data.likes,
          stock: data.stock,
          price: data.price,
          dateStamp: data.date_stamp,
          variations: data.variations || [],
        });

        // Push the product object to the array
        products.push(product);

        db.query('SELECT * FROM product_variations WHERE id = ?', [product.getId()], (error, results) => {
          if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR, null);
            return;
          }

          const variations: ProductVariation[] = [];

          for (const data of results) {
            const variation: ProductVariation = {
              id: data.id,
              productID: data.products_id, 
              variationType: data.product_variation_types_id,
              photoID: data.photo_id,
              name: data.name,
            };

            variations.push(variation);
          }

          product.setVariations(variations);
          products.push(product);
        });
      }

      // Return the products
      callback(null, products);
    });
  }



/**
 * Get Product list from the database using the Product ID generated
 * @param id Product ID
 */
  public static fromId(id: number, callback: (error: ErrorTypes | null, product: Product | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    //Query the database
    db.query("SELECT * FROM products WHERE id = ?", [id], (error, results) => {
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

      db.query('SELECT * FROM product_variations WHERE id = ?', [id], (error, results) => {
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR, null);
          return;
        }
      });

      const variations: ProductVariation[] = [];

      for (const data of results) {
        const variation: ProductVariation = {
          id: data.id,
          productID: data.products_id, 
          variationType: data.product_variation_types_id,
          photoID: data.photo_id,
          name: data.name,
        };

        variations.push(variation);
      }

      // Get result
      const data = results[0];
      // Create Product Object
      const product = new Product({
        id: data.id,
        name: data.name,
        thumbnail: data.thumbnail,
        short_description: data.short_description,
        description: data.description,
        likes: data.likes,
        price: data.price,
        stock: data.stock,
        variations: data.variations,
      });

      // Return the product
      callback(null, product); // (no errors, product object)
    });
  }


  /**
   * Validate Product Data
   * @param data Raw product Data
   */
  public static validate(data: any) {
    // If name is empty
    if (!data.name) return [PRODUCT_EMPTY_NAME, "name"];
    // If Short Description is empty
    if (!data.short_description) return [PRODUCT_EMPTY_SHORT_DESCRIPTION, "short_description"];
    // If Short Description exceeds 128 characters
    if (data.short_description.length > 128) return [PRODUCT_LIMIT_SHORT_DESCRIPTION, "short_description"];
    // If Description is empty
    if (!data.description) return [PRODUCT_EMPTY_DESCRIPTION, 'description'];
    // If Price is empty
    if (!data.price) return [PRODUCT_EMPTY_PRICE, 'price'];
    // If Price is not in correct format
    if (!isNumber(data.price)) return [PRODUCT_INVALID_PRICE, "price"];
    // If Price is less than 0
    if (data.price < 0) return [PRODUCT_LIMIT_PRICE, "price"];
    // If Stock is empty
    if (!data.stock) return [PRODUCT_EMPTY_STOCK, "stock"];
    // If Stock is not in correct format
    if (!isNumber(data.stock)) return [PRODUCT_INVALID_STOCK, "stock"];
    // If Stock is less than 0
    if (data.stock < 0) return [PRODUCT_LIMIT_STOCK, "stock"];
    // If Thumbnail is empty
    if (!data.thumbnail) return [PRODUCT_EMPTY_THUMBNAIL, "thumbnail"];
    // If Thumbnail is not in correct format
    if (!isNumber(data.thumbnail)) return [PRODUCT_INVALID_THUMBNAIL, "thumbnail"];
    
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
    db.query("INSERT INTO products (name, thumbnail, short_description, description, likes, stock, price, date_stamp) VALUES (?,?,?,?,?,?,?,?)", [
      product.name,
      product.thumbnail,
      product.short_description,
      product.description,
      0, // Default likes to 0
      product.stock,
      product.price,
      datestamp
    ], (error, results) => {
      // If has an error
      if (error) {
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Set the primary key ID
      const productID = results.insertId;
      // Set product ID
      product.id = productID;
      // Set likes
      product.likes = 0;
      // Set the date stamp
      product.dateStamp = datestamp;
      // List of variations
      const productVariations = product.variations || []

      // If has variations
      if (productVariations.length > 0) {
        const variationValues = productVariations.map((variation) => [
          productID,
          variation.variationType,
          variation.name,
          variation.photoID,
        ]);

        //Query the database to insert the variations
        db.query("INSERT INTO product_variations (id, products_id, product_variation_types_id, photos_id, name) VALUES ?",
          [variationValues],
          (error) => {
            if (error) {
              Log.e(error.message);
              callback(ErrorTypes.DB_ERROR, null);
              return;
            }
            product.id = productID;

            callback(null, new Product(product));
          }
        );
        
        return;
      }

      // Return the student
      callback(null, new Product(product));
    });
  }

  /**
   * Get primary key ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get name
   */

  public getName() {
    return this.name;
  }

  /**
   * Get Thumbnail 
   */

  public getThumbnail() {
    return this.thumbnail;
  }

  /**
   * Get Short Description
   */

  public getShortDescription() {
    return this.short_description;
  }

  /**
   * Get Description
   */

  public getDescription() {
    return this.description;
  }

  /**
   * Get Likes
   */

  public getLikes() {
    return this.likes;
  }

  /**
   * Get Stock
   */

  public getStock() {
    return this.stock;
  }

  /**
   * Get Price
   */
  public getPrice() {
    return this.price;
  }

  /**
   * Get Variations
   */
  public getVariations(): ProductVariation[] {
    return this.variations;
  }

  /**
   * Set Variations
   */
  public setVariations(variations: ProductVariation[]) {
    this.variations = variations;
  }
}

export default Product;