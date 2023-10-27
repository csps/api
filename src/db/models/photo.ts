import { MariaUpdateResult } from "../../types";
import { ErrorTypes } from "../../types/enums";

import Database from "..";
import Log from "../../utils/log";
import mariadb from "mariadb";

/**
 * Photos model
 * This model represents a photo in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Photo {

  /**
   * Insert photo to the database
   * @param photo Photo data
   */
  public static insert(photo: File, db?: mariadb.PoolConnection): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (!db) {
        // Get database pool connection if not provided
        db = await Database.getConnection();
      }

      // Insert photo
      try {
        // Insert photo
        const result = await db.query<MariaUpdateResult>(
          "INSERT INTO photos (name, type, data, date_stamp) VALUES (?, ?, ?, NOW())", [
            photo.name, photo.type, await photo.text()
          ]
        );

        // If no inserted photo
        if (result.affectedRows === 0) {
          Log.e("No photo inserted");
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Return inserted photo id
        resolve(result.insertId);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

}

export default Photo;