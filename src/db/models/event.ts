import type { MariaUpdateResult } from "../../types";
import type { EventRequest, PaginationOutput } from "../../types/request";
import { ErrorTypes } from "../../types/enums";
import { EventModel } from "../../types/models";

import { isTimeBefore } from "../../utils/date";
import { paginationWrapper } from "../../utils/pagination";
import { isObjectEmpty } from "../../utils/string";

import Database from "../";
import Log from "../../utils/log";
import Strings from "../../config/strings";

/**
 * Event model
 * This model represents the event table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Event {

  /**
   * Get all events
   */
  public static getAll(pagination?: PaginationOutput): Promise<[ EventModel[], count: number ]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get pagination
        if (pagination && !isObjectEmpty(pagination)) {
          const { query, countQuery, values, countValues } = paginationWrapper(db, {
            query: "SELECT * FROM events",
            request: pagination
          });

          const mainResult = await db.query<EventModel[]>(query, values);
          const countResult = await db.query<[{ count: bigint }]>(countQuery, countValues);

          // If no results
          if (mainResult.length === 0) {
            Log.e("No events found");
            return reject(ErrorTypes.DB_EMPTY_RESULT);
          }

          return resolve([mainResult, Number(countResult[0].count) ]);
        }

        // Get all events
        const result = await db.query<EventModel[]>(`SELECT * FROM events`);

        // If no results
        if (result.length === 0) {
          Log.e("No events found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve([ result, Number(result.length) ]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Get next event
   */
  public static getNext(): Promise<EventModel> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get next event
        const result = await db.query<EventModel[]>(`SELECT * FROM events WHERE date > NOW() ORDER BY date ASC LIMIT 1`);

        // If no results
        if (result.length === 0) {
          Log.i("Next event not found!");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve(result[0]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Insert event
   */
  public static insert(request: EventRequest): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = Event.validate(request);

      if (error) {
        return reject(error);
      }

      // Get database instance
      const db = Database.getInstance();
      
      try {
        // Insert new event
        const result = await db.query<MariaUpdateResult>(
          `INSERT INTO events (photos_hash, title, description, venue, date, start_time, end_time, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            request.title, request.venue, request.date, request.start_time, request.end_time
          ]
        );

        // If no results
        if (result.affectedRows === 0) {
          Log.e("Event Insert Failed: No rows affected");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Update event
   * @param id Event ID
   * @param request Event request data
   */
  public static update(id: number | string, request: EventRequest): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = Event.validate(request);

      if (error) {
        return reject(error);
      }

      // Get database instance
      const db = Database.getInstance();
      
      try {
        // Update event
        const result = await db.query<MariaUpdateResult>(
          `UPDATE events SET title = ?, description = ?, venue = ?, date = ?, start_time = ?, end_time = ? WHERE id = ?`, [
            request.title, request.description, request.venue, request.date, request.start_time, request.end_time, id
          ]
        );

        // If no results
        if (result.affectedRows === 0) {
          Log.e("Event Update Failed: No rows affected");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Delete event
   * @param id Event ID
   */
  public static delete(id: number | string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database
      const db = Database.getInstance();
      
      try {
        // If no error, delete event
        const result = await db.query<MariaUpdateResult>("DELETE FROM events WHERE id = ?", [ id ]);

        // If no affected rows
        if (result.affectedRows === 0) {
          Log.e("Event Delete Error: #" + id + " not found!");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Validate Event Data
   * @param data Raw Event Data
   */
  public static validate(data?: EventRequest) {
    // If data is undefined
    if (!data) return [Strings.GENERAL_INVALID_REQUEST, ""];
    // Check if Title is Empty
    if (!data.title) return [Strings.EVENT_EMPTY_TITLE, "title"];
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
}

export default Event;