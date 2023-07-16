import Database, { DatabaseModel } from "../database";
import { ErrorTypes } from "../../types/enums";
import { EventType } from "../../types/models";
import { Log } from "../../utils/log";
import { isDate } from "util/types";
import { is24HourTime } from "../../utils/string";
import { isTimeBefore } from "../../utils/date";

import {
  EVENT_EMPTY_TITLE, EVENT_EMPTY_THUMBNAIL, EVENT_EMPTY_DESCRIPTION,
  EVENT_EMPTY_DATE, EVENT_EMPTY_START_TIME, EVENT_EMPTY_END_TIME,
  EVENT_EMPTY_VENUE, EVENT_INVALID_DATE, EVENT_INVALID_TIME_FORMAT,
  EVENT_INVALID_TIME_ORDER
} from "../../strings/strings.json";

/**
 * Event model
 * @author TotalElderBerry (Brian Keith Lisondra)
 * @author ampats04 (Jeremy Andy F. Ampatin)
 */
class Event extends DatabaseModel {
  private id: number;
  private title: String;
  private description: String;
  private thumbnail: Number;
  private date: Date;
  private startTime: string;
  private endTime: string;
  private venue: String;
  private dateStamp?: string;

  /**
   * Event Model
   * @param data Event data
   */
  private constructor(data: EventType) {
    super();
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.thumbnail = data.thumbnail;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.venue = data.venue;
    this.dateStamp = data.dateStamp;
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
    db.query("SELECT * from events WHERE id = ?", [id], (error, results) => {
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

      // Get the first result
      const data = results[0]
      // Create a new event
      const event = new Event({
        id: data.id,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        date: data.date,
        startTime: data.start_time,
        endTime: data.end_time,
        venue: data.venue,
        dateStamp: data.date_stamp
      });

      // Return the event
      callback(null, event)
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

      // Create an array of empty events
      const allEvents: Event[] = []

      // Loop through the results
      result.forEach((data: any) => {
        // Create a new event
        const event = new Event({
          id: data.id,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          date: data.date,
          startTime: data.start_time,
          endTime: data.end_time,
          venue: data.venue,
          dateStamp: data.date_stamp
        });

        // Push the event to the array
        allEvents.push(event)
      });

      // Return the events
      callback(null, allEvents)
    })
  }
  /**
   * Insert Event Data to the Database
   * @param event 
   * @param callback 
   */
  public static insert(event: EventType, callback: (error: ErrorTypes | null, event: Event | null ) => void) {
    // Get Database Instance
    const db = Database.getInstance();

    // Query the Database
    db.query("INSERT INTO events (title, thumbnail, description, date, start_time, end_time, venue) VALUES (?,?,?,?,?,?,?)",[
      event.thumbnail,
      event.title,
      event.description,
      event.date,
      event.startTime,
      event.endTime,
      event.venue,
    ], (error, results) => {
      //If has an error
      if (error){
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      //Set the primary key ID
      event.id = results.insertId;
      
      // Return the Event
      callback(null, new Event(event));
    });
  }

  /**
   * Validate Event Data
   * @param data Raw Event Data
   */
  public static validate(data: any) {
    // Check if Title is Empty
    if (!data.title) return [EVENT_EMPTY_TITLE, "title"];
    // Check if Thumbnail is Empty
    if (!data.thumbnail) return [EVENT_EMPTY_THUMBNAIL, "thumbnail"];
    // Check if Description is Empty
    if (!data.description) return [EVENT_EMPTY_DESCRIPTION, "description"];
    // Check if date is Empty
    if (!data.date) return [EVENT_EMPTY_DATE, "date"];
    // Check if Start Time is Empty
    if (!data.start_time) return [EVENT_EMPTY_START_TIME, "start_time"];
    // Check if End Time is Empty
    if (!data.end_time) return [EVENT_EMPTY_END_TIME, "end_time"];
    // Check if Venue is Empty
    if (!data.venue) return [EVENT_EMPTY_VENUE, "venue"];
    // Check if Date is invalid
    if (!isDate(data.date)) return [EVENT_INVALID_DATE, "date"];
    // Check if Start Time is invalid
    if (!is24HourTime(data.startTime)) return [EVENT_INVALID_TIME_FORMAT, "start_time"];
    // Check if End Time is invalid
    if (!is24HourTime(data.endTime)) return [EVENT_INVALID_TIME_FORMAT, "end_time"];
    // // Check if End Time is earlier than Start Time
    if (!isTimeBefore(data.startTime, data.endTime)) return [EVENT_INVALID_TIME_ORDER, "start_time"];
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
   * Get Start Time
   */
  public getStartTime() {
    return this.startTime;
  }

  /**
   * Get End Time
   */
  public getEndTime() {
    return this.endTime;
  }

  /**
   * Get published date stamp
   */
  public getDateStamp() {
    return this.dateStamp;
  }
}

export default Event;