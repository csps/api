import { MariaUpdateResult } from "../../types";
import { ErrorTypes } from "../../types/enums";

import { PhotoModel } from "../../types/models";
import { generateHash } from "../../utils/security";
import Log from "../../utils/log";
import mariadb from "mariadb";
import Database from "..";

/**
 * Photos model
 * This model represents a photo in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Photo {

  /**
   * Get photo by hash
   * @param id Photo hash
   */
  public static getByHash(hash: string): Promise<File> {
    return new Promise(async (resolve, reject) => {
      // Get database pool connection
      const db = Database.getInstance();

      // Get photo
      try {
        const result = await db.query<PhotoModel[]>(
          "SELECT * FROM photos WHERE hash = ? LIMIT 1", [hash]
        );

        // If no photo found
        if (result.length === 0) {
          Log.e("No photo found");
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Create File object
        const photo = new File([result[0].data], result[0].name || "unknown", {
          type: result[0].type
        });

        // Return photo
        resolve(photo);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Insert photo to the database
   * @param photo Photo data
   */
  public static insert(photo?: File, db?: mariadb.PoolConnection): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!db) {
        // Get database pool connection if not provided
        db = await Database.getConnection();
      }

      // if photo is undefined
      if (!photo) {
        Log.e("Photo is undefined");
        return reject(ErrorTypes.REQUEST_FILE);
      }

      // Generate hash for the photo
      const hash = generateHash(16);

      try {
        // Insert photo
        const result = await db.query<MariaUpdateResult>(
          "INSERT INTO photos (hash, name, type, data, date_stamp) VALUES (?, ?, ?, ?, NOW())", [
            hash, photo.name, photo.type, Buffer.from(await photo.arrayBuffer())
          ]
        );

        // If no inserted photo
        if (result.affectedRows === 0) {
          Log.e("No photo inserted");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Return hash
        resolve(hash);
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