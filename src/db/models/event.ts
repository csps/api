import Database from "../database";
import { DatabaseModel, ErrorTypes } from "../../types";

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
   * 
   * @param id Event ID
   * @param title Event Title
   * @param description Event Description
   * @param thumbnail Event Thumbnail
   * @param date Event Date
   * @param startTime Event Start Time 
   * @param endTime Event End Time
   * @param venue Event venue
   */
  private constructor(
    id: number,
    title: string,
    description: string,
    thumbnail: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    venue: string,
  ) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.venue = venue;
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
      const event = new Event(
        data.id,
        data.title,
        data.description,
        data.thumbnail,
        data.date,
        data.startTime,
        data.endTime,
        data.venue
      )

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
        const event = new Event(
          data.id,
          data.title,
          data.description,
          data.thumbnail,
          data.date,
          data.startTime,
          data.endTime,
          data.venue
        )
        allEvents.push(event)
      });

      callback(null, allEvents)
    })
  }
}

export default Event