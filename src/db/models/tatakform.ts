import { ErrorTypes } from "../../types/enums";
import { TatakformModel } from "../../types/models";

import Log from "../../utils/log";
import Database from "../";

/**
 * TatakForm model
 * This model represents the tatakforms table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Tatakform {
  /**
   * Get all courses
   */
  public static getAll(): Promise<TatakformModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all courses
        const result = await db.query<TatakformModel[]>(
          `SELECT * FROM tatakforms ORDER BY from_date DESC`
        );

        // If no results
        if (result.length === 0) {
          Log.e("No tatakforms found");
          return reject("No tatakforms found");
        }

        // Return tatakforms list
        resolve(result);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
}

export default Tatakform;