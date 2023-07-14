import { Log } from "../../utils/log";
import { ErrorTypes } from "../../types/enums";
import Database, { DatabaseModel } from "../database";
import { isNumber } from "../../utils/string";
import { getDatestamp } from "../../utils/date";
import type { ProductType, ProductVariation } from "../../types/models";

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
          short_description: data.short_descprition,
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
    //check if name is empty
    if (!data.name) return ["Name is required!", "name"];
    //check if Short Description is empty
    if (!data.short_description) return ["Short Description is required!", "short_description"];
    //check if Description is empty
    if (!data.description) return ["Description is required", 'description'];
    //Check if Price is empty
    if (!data.price) return ["Price is required!", 'price'];
    //Check if Short Description doesn't exceed 128 characters
    if (data.short_description.length > 128) return ["Short Description must not exceed 128 characters!", "short_description"];
    // If not stock
    if (!data.stock) return ["Stock is required!", "stock"];
    //Check if stocks is not less than 0
    if (data.stock < 0) return ["Stocks must not be below 0", "stock"];
    //Check if Thumbnail is in Numeric
    if (!isNumber(data.thumbnail)) return ["Thumbnail Format must be numeric", "thumbnail"];
    //Check if price is in correct format
    if (!isNumber(data.price)) return ["Price must be Numeric", "price"];
    //Check if price is below 0
    if (data.price < 0) return ["Price must be greater than 0", "price"];
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
        console.log(error);
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