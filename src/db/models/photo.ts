import { Log } from "../../utils/log";
import { ErrorTypes } from "../../types/enums";
import { getDatestamp } from "../../utils/date";
import type { PhotoModel } from "../../types/models";
import type { PhotoRequest } from "../../types/request";
import Database, { DatabaseModel } from "../database";
import Strings from "../../config/strings";
import { FileArray } from "express-fileupload";
import { getFile } from "../../utils/file";
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
    db.query(`SELECT * FROM ${Tables.PHOTOS} WHERE id = ?`, [id], (error, results) => {
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
   * Get receipt from the database using receipt ID
   * @param id Recept ID
   * @param callback Callback function
   */
  public static fromReceipt(id: string, callback: (error: ErrorTypes | null, photo: Photo | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query(`SELECT * FROM ${Tables.RECEIPTS} WHERE receipt_id = ?`, [id], (error, results) => {
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
  public static insert(photo: PhotoRequest, callback: (error: ErrorTypes | null, photoId: number | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();
    // Query (photo)
    let query = `INSERT INTO ${Tables.PHOTOS} (name, type, data, date_stamp) VALUES (?, ?, ?, ?)`;
    let data = [ photo.name || null, photo.type, photo.data, datestamp ];

    // If receipt
    if (photo.receipt_id) {
      // Query (receipt)
      query = `INSERT INTO ${Tables.RECEIPTS} (receipt_id, name, type, data, date_stamp) VALUES (?, ?, ?, ?, ?)`;
      data = [ photo.receipt_id, photo.name || null, photo.type, photo.data, datestamp ];
    }

    // Query the database
    db.query(query, data, (error, results) => {
      // If has an error  
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Return photo ID
      callback(null, results.insertId);
    });
  }

  /**
   * Validate photo data 
   * @param data Photo data
   */
  public static validate(files?: FileArray | null) {
    if (!getFile(files, 'data')) return [Strings.PHOTO_EMPTY_DATA, "data"];
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