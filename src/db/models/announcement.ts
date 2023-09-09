import { FileArray } from "express-fileupload";
import Strings from "../../config/strings";
import { ErrorTypes } from "../../types/enums";
import { AnnouncementModel, PhotoModel } from "../../types/models";
import { AnnouncementRequest, PaginationRequest, PhotoRequest } from "../../types/request";
import { getDatestamp } from "../../utils/date";
import { Log } from "../../utils/log";
import { PaginationQuery, paginationWrapper } from "../../utils/query";
import Database, { DatabaseModel } from "../database";
import { Photo } from "./photo";
import { getFile } from "../../utils/file";
import { request } from "http";

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
   * Find announcements
   * @param param PaginationRequest
   */
  public static find(param: PaginationRequest, callback: (error: ErrorTypes | null, announcements: Announcement[] | null, count?: number) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Data
    const data: PaginationQuery = {
      query: "SELECT * FROM announcements",
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
  public static insert(announcement: AnnouncementRequest, files: FileArray | null | undefined, callback: (error: ErrorTypes | null, announcement: Announcement | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // Insert the announcement
    function insert(photos_id?: number) {
      // Query the database
      db.query("INSERT INTO announcements (admin_student_id, title, content, photos_id, date_stamp) VALUES (?, ?, ?, ?, ?)", [
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

    // Get photo (if has any)
    const photo = getFile(files, "photo");

    if (photo) {
      // Photo
      Photo.insert({
        data: photo.data,
        type: photo.mimetype,
      }, (error, photoId) => {
        // If has an error
        if (error === ErrorTypes.DB_ERROR) {
          callback(error, null);
          return;
        }

        // If photo add success, insert the announcement
        insert(photoId!);
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
  public static validate(data: AnnouncementRequest) {
    // If has no title
    if (!data.title) return [Strings.ANNOUNCEMENTS_INVALID_TITLE, "title"];
    // If has no content
    if (!data.content) return [Strings.ANNOUNCEMENTS_INVALID_CONTENT, "content"];
  
    // Return null if valid
    return null;
  }

}

export default Announcement;