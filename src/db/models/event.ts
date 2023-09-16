import type { PoolConnection } from "mysql";
import Database, { DatabaseModel } from "../database";
import { ErrorTypes } from "../../types/enums";
import { EventModel } from "../../types/models";
import { Log } from "../../utils/log";
import { getDatestamp, isTimeBefore } from "../../utils/date";
import { FileArray } from "express-fileupload";
import { getFile } from "../../utils/file";
import { Photo } from "./photo";
import { Tables } from "../structure";
import { PaginationRequest } from "../../types/request";
import { PaginationQuery, paginationWrapper } from "../../utils/query";
import Strings from "../../config/strings";

/**
 * Event model
 * @author TotalElderBerry (Brian Keith Lisondra)
 * @author ampats04 (Jeremy Andy F. Ampatin)
 * @author mavyfaby (Maverick Fabroa)
 */
class Event extends DatabaseModel {
  private id: number;
  private thumbnail?: number;
  private title: string;
  private description: string;
  private venue: string;
  private date: string;
  private start_time: string;
  private end_time: string;
  private date_stamp?: string;

  /**
   * Event Model
   * @param data Event data
   */
  private constructor(data: EventModel) {
    super();
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.thumbnail = data.thumbnail;
    this.date = data.date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.venue = data.venue;
    this.date_stamp = data.date_stamp;
  }

  /**
   * Get the event by its ID
   * @param id Event ID
   * @param callback Callback function
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, event: Event | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM events WHERE id = ?", [id], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return
      }

      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null)
        return
      }

      // Get the first reuslt and return the event
      callback(null, new Event(results[0]));
    })
  }

  /**
   * Find products
   * @param param PaginationRequest
   */
  public static find(param: PaginationRequest, callback: (error: ErrorTypes | null, events: EventModel[] | null, count?: number) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Data
    const data: PaginationQuery = {
      query: "SELECT * FROM events",
    };

    // If search column and value is present
    if (param.search_column && param.search_value) {
      const cols = JSON.parse(param.search_column);
      const vals = JSON.parse(param.search_value);

      data.search = cols.map((column: string, index: number) => {
        return { column, value: vals[index] };
      });
    }

    // If student column and type is present
    if (param.sort_column && param.sort_type) {
      data.order = { column: param.sort_column, type: param.sort_type };
    }

    // If page and limit is present
    if (param.page && param.limit) {
      data.pagination = { page: parseInt(param.page), limit: parseInt(param.limit) };
    }

    // Get pagination
    const { query, values, countQuery, countValues } = paginationWrapper(data);

    // Query the database
    db.query(query, values, (error, results) => {
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

      db.query(countQuery, countValues, (error, countResults) => {
        // If has an error
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR, null);
          return;
        }

        // Create and return the orders with count
        callback(null, results, countResults[0].count);
      });
    });
  }

  /**
   * Get all events
   * @param callback 
   */
  public static getAll(callback: (error: ErrorTypes | null, events: Event[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM events", [], (err, result) => {
      // If has error
      if (err) {
        callback(ErrorTypes.DB_ERROR, null)
        return
      }

      // If no results
      if (result.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null)
        return
      }

      // Create and return the events
      callback(null, result.map((data: EventModel) => new Event(data)));
    })
  }
  /**
   * Insert Event Data to the Database
   * @param event 
   * @param callback 
   */
  public static insert(event: EventModel, files: FileArray | null | undefined, callback: (error: ErrorTypes | null, event: Event | null ) => void) {
    // Get date stamp
    const stamp = getDatestamp();
    // Photo (if any)
    const thumbnail = getFile(files, "thumbnail");
    
    // Get database instance
    Database.getConnection((error, conn) => {
      if (error) {
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }
      
      // If has submitted event photo
      if (files && thumbnail) {
        // Begin transaction
        conn.beginTransaction((error) => {
          if (error) {
            callback(ErrorTypes.DB_ERROR, null);
            return;
          }

          // Insert the event photo
          Photo.insert({
            data: thumbnail.data,
            type: thumbnail.mimetype,
            name: thumbnail.name
          }, (error, photoId) => {
            if (error) {
              // Rollback transaction
              conn.rollback(() => {
                callback(ErrorTypes.DB_ERROR, null);
              });

              return;
            }

            // Insert the event data
            insert(photoId);
          });
        });

        return;
      }

      /**
       * Insert the Event Data
       * @param photoId Photo ID
       */
      function insert(photoId: number | null) {
        // Query the Database
        conn.query(`INSERT INTO ${Tables.EVENTS} (thumbnail, title, description, venue, date, start_time, end_time, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
          photoId,
          event.title,
          event.description,
          event.venue,
          event.date,
          event.start_time,
          event.end_time,
          stamp
        ], (error, results) => {
          if (error) {
            Log.e(error.message);
            // Rollback transaction
            conn.rollback(() => {
              callback(ErrorTypes.DB_ERROR, null);
            });
  
            return;
          }
    
          // Set the primary key ID 
          event.id = results.insertId;
          // Set date stamp
          event.date_stamp = stamp;
  
          // Commit transaction
          conn.commit(() => {
            callback(null, new Event(event));
          });
        });
      }

      // Otherwise, insert the event data
      insert(null);
    });
  }

  /**
   * Validate Event Data
   * @param data Raw Event Data
   */
  public static validate(data: EventModel) {
    // Check if Title is Empty
    if (!data.title) return [Strings.EVENT_EMPTY_TITLE, "title"];
    // Check if Description is Empty
    if (!data.description) return [Strings.EVENT_EMPTY_DESCRIPTION, "description"];
    // Check if Venue is Empty
    if (!data.venue) return [Strings.EVENT_EMPTY_VENUE, "venue"];
    // Check if date is empty
    if (!data.date) return [Strings.EVENT_EMPTY_DATE, "date"];
    // Check if start time is empty
    if (!data.start_time) return [Strings.EVENT_EMPTY_START_TIME, "start_time"];
    // Check if end time is empty
    if (!data.end_time) return [Strings.EVENT_EMPTY_END_TIME, "end_time"];
    // Check if End Time is earlier than Start Time
    if (!isTimeBefore(data.start_time, data.end_time)) return [Strings.EVENT_INVALID_DATE_ORDER, "start_time"];
  }

  /**
   * Get the Primary ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get thumbnail
   */
  public getThumbnail() {
    return this.thumbnail;
  }

  /**
   * Get Description
   */
  public getDescription() {
    return this.description;
  }

  /**
   * Get event title 
   */
  public getTitle() {
    return this.title;
  }

  /**
   * Get event venue
   */
  public getVenue() {
    return this.venue;
  }

  /**
   * Get event date
   */
  public getDate() {
    return this.date;
  }

  /**
   * Get event start time
   */
  public getStartTime() {
    return this.start_time;
  }

  /**
   * Get event end time
   */
  public getEndTime() {
    return this.end_time;
  }

  /**
   * Get published date stamp
   */
  public getDatestamp() {
    return this.date_stamp;
  }
}

export default Event;