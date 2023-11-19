import { ErrorTypes } from "../../types/enums";
import { AnnouncementModel } from "../../types/models";
import { AnnouncementRequest } from "../../types/request";
import { MariaUpdateResult } from "../../types";

import Log from "../../utils/log";
import Database from "../";
import Strings from "../../config/strings";
import Photo from "./photo";

/**
 * Announcement Model
 * This model represents the announcements table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Announcement {

  /**
   * Get all announcements
   */
  public static getAll(): Promise<AnnouncementModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all announcements
        const result = await db.query<AnnouncementModel[]>("SELECT * FROM announcements ORDER BY id DESC");

        // If no results
        if (result.length === 0) {
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        resolve(result);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Insert new announcement
   * @param request Announcement request data
   */
  public static insert(request: AnnouncementRequest): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = Announcement.validate(request);

      if (error) {
        return reject(error);
      }

      // Get database pool connection
      const db = await Database.getConnection();
      
      try {
        // Begin transaction
        await db.beginTransaction();
        // Default Photo Hash
        let photoHash: string | null = null;

        // Check for photo
        if (request.photo) {
          try {
            // Insert photo
            photoHash = await Photo.insert({ photo: request.photo, db });
          }

          catch (e) {
            // If no photo inserted
            if (e === ErrorTypes.DB_EMPTY_RESULT) {
              Log.e("Announcement Insert Error: photo attached but no photo inserted");
              await db.rollback();
              return reject(ErrorTypes.DB_EMPTY_RESULT);
            }

            // If database error
            if (e === ErrorTypes.DB_ERROR) {
              Log.e("Announcement Insert Error: database error");
              await db.rollback();
              return reject(ErrorTypes.DB_ERROR);
            }
          }
        }

        // If no error, insert announcement
        const result = await db.query<MariaUpdateResult>(
          "INSERT INTO announcements (admin_student_id, title, content, photos_hash, date_stamp) VALUES (?, ?, ?, ?, NOW())", [
            1, request.title, request.content, photoHash
          ]
        );

        // If no affected rows
        if (result.affectedRows === 0) {
          Log.e("Announcement Insert Error: no affected rows");
          await db.rollback();
          return reject(ErrorTypes.DB_ERROR);
        }

        // Commit and resolve transaction
        await db.commit();
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        await db.rollback();
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Update announcement
   * @param id Announcement ID
   * @param request Announcement request data
   */
  public static update(id: number | string, request: AnnouncementRequest): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = Announcement.validate(request);

      if (error) {
        return reject(error);
      }

      // Get database pool connection
      const db = await Database.getConnection();
      
      try {
        // Begin transaction
        await db.beginTransaction();
        // Default Photo Hash
        let photoHash: string | null = null;

        // Check for photo
        if (request.photo) {
          try {
            // Insert photo
            photoHash = await Photo.insert({ photo: request.photo, db });
          }

          catch (e) {
            // If no photo inserted
            if (e === ErrorTypes.DB_EMPTY_RESULT) {
              Log.e("Announcement Update Error: photo attached but no photo inserted");
              await db.rollback();
              return reject(ErrorTypes.DB_EMPTY_RESULT);
            }

            // If database error
            if (e === ErrorTypes.DB_ERROR) {
              Log.e("Announcement Update Error: database error");
              await db.rollback();
              return reject(ErrorTypes.DB_ERROR);
            }
          }
        }

        // If no error, update announcement
        const result = await db.query<MariaUpdateResult>(
          "UPDATE announcements SET title = ?, content = ?, photos_hash = ? WHERE id = ?", [
            request.title, request.content, photoHash, id
          ]
        );

        // If no affected rows
        if (result.affectedRows === 0) {
          Log.e("Announcement Update Error: #" + id + " not found!");
          await db.rollback();
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Commit and resolve transaction
        await db.commit();
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        await db.rollback();
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Delete announcement
   * @param id Announcement ID
   */
  public static delete(id: number | string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database
      const db = Database.getInstance();
      
      try {
        // If no error, delete announcement
        const result = await db.query<MariaUpdateResult>("DELETE FROM announcements WHERE id = ?", [ id ]);

        // If no affected rows
        if (result.affectedRows === 0) {
          Log.e("Announcement Delete Error: #" + id + " not found!");
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
   * Validate the announcement raw data
   * @param raw Raw data
   */
  public static validate(data?: AnnouncementRequest): string[] | null {
    // If no data
    if (!data) return [Strings.GENERAL_INVALID_REQUEST];
    // If has no title
    if (!data.title) return [Strings.ANNOUNCEMENTS_INVALID_TITLE, "title"];
    // If has no content
    if (!data.content) return [Strings.ANNOUNCEMENTS_INVALID_CONTENT, "content"];
  
    // Return null if valid
    return null;
  }

}

export default Announcement;