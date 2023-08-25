import { Log } from "../../utils/log";
import { ErrorTypes } from "../../types/enums";
import { getDatestamp } from "../../utils/date";
import type { PhotoRequest, PhotoModel } from "../../types/models";
import Database, { DatabaseModel } from "../database";
import Strings from "../../config/strings";
import { Tables } from "../structure";

/**
 * Photos model
 * This model represents a photo in the database
 * @author mavyfaby (Maverick Fabroa)
 */
export class Photo extends DatabaseModel {
  private id: number;
  private name?: string;
  private data: Buffer;
  private type: string;
  private date_stamp?: string;

  /**
   * Photo Private Constructor
   * @param data Photo data
   */
  public constructor(data: PhotoModel) {
    super();
    this.id = data.id;
    this.data = data.data;
    this.type = data.type;
    this.date_stamp = data.date_stamp;
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

      // Get the first result and return the photo
      callback(null, new Photo(results[0]));
    });
  }

  /**
   * Insert photo to the database
   * @param student Photo data
   * @param callback Callback function
   */
  public static insert(photo: PhotoRequest, callback: (error: ErrorTypes | null, photo: Photo | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // Query the database
    db.query(`INSERT INTO ${photo.is_receipt ? Tables.RECEIPTS : Tables.PHOTOS} (data, name, type, date_stamp) VALUES (?, ?, ?, ?)`, [
      photo.data,
      photo.name || null,
      photo.type,
      datestamp
    ], (error, results) => {
      // If has an error  
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // New photo
      const p: PhotoModel = {
        id: results.insertId,
        date_stamp: datestamp,
        ...photo,
      };

      // Set the date stamp
      p.date_stamp = datestamp;
      // Return the student
      callback(null, new Photo(p));
    });
  }

  /**
   * Validate photo data 
   * @param data Photo data
   */
  public static validate(data: any) {
    // If data is empty
    if (!data.data) return [Strings.PHOTO_EMPTY_DATA, "data"];
    // If type is empty
    if (!data.type) return [Strings.PHOTO_EMPTY_TYPE, "type"];
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getData() {
    return this.data;
  }

  public getType() {
    return this.type;
  }

  public getDatestamp() {
    return this.date_stamp;
  }
}