import Database from "../database";
import { DatabaseModel, ErrorTypes } from "../../types";
import { EventType } from "../../types/models";

/**
 * Event model
 * @author TotalElderBerry (Brian Keith Lisondra)
 */
class Event extends DatabaseModel {
  private id: number;
  private title: String;
  private description: String;
  private thumbnail: String;
  private date: Date;
  private startTime: Date;
  private endTime: Date;
  private venue: String;

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
        console.log(error);
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
        startTime: data.startTime,
        endTime: data.endTime,
        venue: data.venue
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
    const db = Database.getInstance();

    db.query("SELECT * FROM events", [], (err, result) => {
      if (err) {
        callback(ErrorTypes.DB_ERROR, null)
        return
      }

      if (result.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null)
        return
      }

      const allEvents: Event[] = []

      result.forEach((data: any) => {
        // Create a new event
        const event = new Event({
          id: data.id,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          venue: data.venue
        });

        allEvents.push(event)
      });

      callback(null, allEvents)
    })
  }
}

export default Event