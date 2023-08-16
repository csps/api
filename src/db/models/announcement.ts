import { ErrorTypes } from "../../types/enums";
import { AnnouncementType, PhotoType } from "../../types/models";
import { getDatestamp } from "../../utils/date";
import { Log } from "../../utils/log";
import Database, { DatabaseModel } from "../database";
import { Photo } from "./photo";

class Announcement extends DatabaseModel{
    private id: number;
    private title: string;
    private content: string;
    private photo_id: number;
    private date_stamp: string;

      /**
   * Event Model
   * @param data Event data
   */
  private constructor(data: AnnouncementType) {
    super();
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.photo_id = data.photo_id;
    this.date_stamp = data.date_stamp;
  }

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
     callback(null, result.map((data: AnnouncementType) => new Announcement(data)));
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
      callback(null, results.map((announcement: AnnouncementType) => new Announcement(announcement)));
    });
  }

  public static insert(announcement: AnnouncementType,photo: PhotoType, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    Photo.insert(photo,(err,ph) => {
      if(err){
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }
      // Query the database
      db.query("INSERT INTO announcements (title, content, photo_id, date_stamp) VALUES (?, ?, ?, ?)", [
        announcement.title,
        announcement.content,
        ph?.getId,
        datestamp
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
      
    })

  }

  public static update(announcement: AnnouncementType,photo: PhotoType, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    db.query("UPDATE announcements SET title = ?, content = ?, photo_id = ? WHERE id  = ?", [
      announcement.title,
      announcement.content,
      announcement.photo_id,
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
    // Get the current date
    const datestamp = getDatestamp();

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

}

export default Announcement;