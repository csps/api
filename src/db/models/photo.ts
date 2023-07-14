import { Log } from "../../utils/log";
import { ErrorTypes } from "../../types/enums";
import { getDatestamp } from "../../utils/date";
import type { PhotoType } from "../../types/models";
import Database, { DatabaseModel } from "../database";

/**
 * Photos model
 * This model represents a photo in the database
 * @author mavyfaby (Maverick Fabroa)
 */
export class Photo extends DatabaseModel {
  private id: number;
  private data: Buffer;
  private type: string;
  private width: number;
  private height: number;
  private dateStamp?: string;

  /**
   * Photo Private Constructor
   * @param data Photo data
   */
  public constructor(data: PhotoType) {
    super();
    this.id = data.id;
    this.data = data.data;
    this.type = data.type;
    this.width = data.width;
    this.height = data.height;
    this.dateStamp = data.dateStamp;
  }

  /**
   * Get photo from the database using its assigned ID
   * @param id Photo ID
   * @param callback Callback function
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, photo: Photo | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM photos WHERE id = ?", [id], (error, results) => {
      // If has error
      if (error) {
        console.error(error);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Get the first result
      const result = results[0];
      // Create a new photo
      const photo = new Photo({
        id: result.id,
        data: result.data,
        type: result.type,
        width: result.width,
        height: result.height,
        dateStamp: result.date_stamp
      });

      // Return the photo
      callback(null, photo);
    });
  }

  /**
   * Insert photo to the database
   * @param student Photo data
   * @param callback Callback function
   */
  public static insert(photo: PhotoType, callback: (error: ErrorTypes | null, photo: Photo | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // Query the database
    db.query("INSERT INTO photos (data, type, width, height, date_stamp) VALUES (?, ?, ?, ?, ?)", [
      photo.data,
      photo.type.trim(),
      photo.width,
      photo.height,
      datestamp
    ], (error, results) => {
      // If has an error  
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Set the date stamp
      photo.dateStamp = datestamp;

      // Return the student
      callback(null, new Photo(photo));
    });
  }

  /**
   * Validate photo data 
   * @param data Photo data
   */
  public static validate(data: any) {
    // If data is empty
    if (!data.data) return ["Empty data!", "data"];
    // If type is empty
    if (!data.type) return ["Empty type!", "type"];
    // If width is empty
    if (!data.width) return ["Empty width!", "width"];
    // If height is empty
    if (!data.height) return ["Empty height!", "height"];
  }

  /**
   * Get ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get data
   */
  public getData() {
    return this.data;
  }

  /**
   * Get type
   */
  public getType() {
    return this.type;
  }

  /**
   * Get width
   */
  public getWidth() {
    return this.width;
  }

  /**
   * Get height
   */
  public getHeight() {
    return this.height;
  }

  /**
   * Get date stamp
   */
  public getDatestamp() {
    return this.dateStamp;
  }
}