import Database, { DatabaseModel } from "../database";
import { ErrorTypes } from "../../types/enums";
import { EventModel } from "../../types/models";
import { Log } from "../../utils/log";
import { isDate } from "../../utils/string";
import { is24HourTime } from "../../utils/string";
import { getDatestamp, isTimeBefore } from "../../utils/date";
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
  private start_date_stamp: string;
  private end_date_stamp: string;
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
    this.start_date_stamp = data.start_date_stamp;
    this.end_date_stamp = data.end_date_stamp;
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
  public static insert(event: EventModel, callback: (error: ErrorTypes | null, event: Event | null ) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get date stamp
    const stamp = getDatestamp();

    // Query the Database
    db.query("INSERT INTO events (thumbnail, title, description, venue, start_date_stamp, end_date_stamp, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",[
      event.thumbnail || null,
      event.title,
      event.description,
      event.venue,
      event.start_date_stamp,
      event.end_date_stamp,
      stamp
    ], (error, results) => {
      //If has an error
      if (error){
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Set the primary key ID 
      event.id = results.insertId;
      // Set date stamp
      event.date_stamp = stamp;
      // Return the Event
      callback(null, new Event(event));
    });
  }

  /**
   * Validate Event Data
   * @param data Raw Event Data
   */
  public static validate(data: EventModel) {
    // Check if Title is Empty
    if (!data.title) return [Strings.EVENT_EMPTY_TITLE, "title"];
    // Check if Thumbnail is Empty
    if (!data.thumbnail) return [Strings.EVENT_EMPTY_THUMBNAIL, "thumbnail"];
    // Check if Description is Empty
    if (!data.description) return [Strings.EVENT_EMPTY_DESCRIPTION, "description"];
    // Check if Venue is Empty
    if (!data.venue) return [Strings.EVENT_EMPTY_VENUE, "venue"];
    // Check if Start Time is Empty
    if (!data.start_date_stamp) return [Strings.EVENT_EMPTY_START_DATE_STAMP, "start_date_stamp"];
    // Check if End Time is Empty
    if (!data.end_date_stamp) return [Strings.EVENT_EMPTY_END_DATE_STAMP, "end_date_stamp"];
    // Check if End Time is earlier than Start Time
    if (!isTimeBefore(data.start_date_stamp, data.end_date_stamp)) return [Strings.EVENT_INVALID_DATE_ORDER, "start_date_stamp"];
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
   * Get event start date
   */
  public getStartDate() {
    return this.start_date_stamp;
  }

  /**
   * Get event end date
   */
  public getEndDate() {
    return this.end_date_stamp;
  }

  /**
   * Get published date stamp
   */
  public getDatestamp() {
    return this.date_stamp;
  }
}

export default Event;