import Strings from "../../config/strings";
import { ErrorTypes } from "../../types/enums";
import { AnnouncementModel, PhotoModel } from "../../types/models";
import { AnnouncementRequest } from "../../types/request";
import { getDatestamp } from "../../utils/date";
import { Log } from "../../utils/log";
import Database, { DatabaseModel } from "../database";
import { Photo } from "./photo";

class Announcement extends DatabaseModel{
    private id: number;
    private title: string;
    private content: string;
    private photos_id?: number;
    private date_stamp: string;
    private admin_student_id: string;

      /**
   * Event Model
   * @param data Event data
   */
  private constructor(data: AnnouncementModel) {
    super();

    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.photos_id = data.photos_id;
    this.date_stamp = data.date_stamp;
    this.admin_student_id = data.admin_student_id;
  }

  /**
   * Get announcement by ID
   * @param id Announcement ID
   * @param callback Callback function
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void){
    const db = Database.getInstance();

    db.query("SELECT * from announcements where id = ?", [id], (error,results) => {
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
      callback(null, new Announcement(results[0]));
    })

  }

  /**
   * Get all announcements
   */
  public static getAll(callback: (error: ErrorTypes | null, announcement: Announcement[] | null) => void): void {
   // Get database instance
   const db = Database.getInstance();

   // Query the database
   db.query("SELECT * FROM announcements", [], (err, result) => {
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

     // Create and return the announcements
     callback(null, result.map((data: AnnouncementModel) => new Announcement(data)));
   })   
  }

  public static fromAcademicYear(year: number, callback: (error: ErrorTypes | null, tutorial: Announcement[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get start date
    const startDate = `${year}-08-01`;
    // Get end date
    const endDate = `${year + 1}-07-01`;

    // Query the database
    db.query("SELECT * FROM announcements WHERE date_stamp >= ? AND date_stamp < ?", [startDate, endDate], (error, results) => {
      // If has error
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

      // Create and return tutorials
      callback(null, results.map((announcement: AnnouncementModel) => new Announcement(announcement)));
    });
  }

  /**
   * Get announcement data
   * @param announcement Announcement request data
   * @param callback Callback function
   */
  public static insert(announcement: AnnouncementRequest, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // Insert the announcement
    function insert(photos_id?: number) {
      // Query the database
      db.query("INSERT INTO announcements (admin_student_id, title, content, photo_id, date_stamp) VALUES (?, ?, ?, ?, ?)", [
        "-", // TODO: Add admin student id
        announcement.title,
        announcement.content,
        photos_id || null,
        datestamp
      ], (error, results) => {
        // If has an error
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR, null);
          return;
        }
  
        // Return the student
        callback(null, new Announcement({
          id: results.insertId,
          admin_student_id: "-", // TODO: Add admin student id
          title: announcement.title,
          content: announcement.content,
          date_stamp: datestamp,
          photos_id,
        }));
      });
    }

    // Get photo data if has one
    const { photo_data, photo_type } = announcement;

    // If has photo
    if (photo_data && photo_type) {
      // Photo
      Photo.insert({
        data: Buffer.from(photo_data, 'base64'),
        type: photo_type,
      }, (error, photo) => {
        // If has an error
        if (error) {
          callback(error, null);
          return;
        }

        // If photo add success, insert the announcement
        insert(photo?.getId());
      });

      return;
    }

    // Otherwise, insert the announcement
    insert();
  }

  public static update(announcement: AnnouncementModel, photo: PhotoModel, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    db.query("UPDATE announcements SET title = ?, content = ?, photos_id = ? WHERE id  = ?", [
      announcement.title,
      announcement.content,
      announcement.photos_id,
      announcement.id
    ], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // Return the student
      callback(null, new Announcement(announcement));
    });

  }

  public static delete(id: number, callback: (error: ErrorTypes | null, success: boolean) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("DELETE from announcements where id = ?", [
      id,
    ], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, false);
        return;
      }

      callback(null, true);
    });
  }

  /**
   * Validate the announcement raw data
   * @param raw Raw data
   */
  public static validate(raw: any) {
    // If has no title
    if (!raw.title) return [Strings.ANNOUNCEMENTS_INVALID_TITLE, "title"];
    // If has no content
    if (!raw.content) return [Strings.ANNOUNCEMENTS_INVALID_CONTENT, "content"];
  
    // if has one of the photo data
    if (raw.photo_data || raw.photo_type) {
      // Validate photo
      const error = Photo.validate({
        data: raw.photo_data,
        type: raw.photo_type,
      });

      // If has an error
      if (error) return error;
    }

    // Return null if valid
    return null;
  }

}

export default Announcement;