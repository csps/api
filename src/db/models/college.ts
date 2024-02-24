import { ErrorTypes } from "../../types/enums";

import type { CollegeModel } from "../../types/models";
import { MariaUpdateResult } from "../../types";

import Log from "../../utils/log";
import Database from "../";

/**
 * College model
 * This model represents the colleges table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class College {

  /**
   * Get all courses
   */
  public static getAll(): Promise<CollegeModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all courses
        const result = await db.query<CollegeModel[]>(`SELECT * FROM colleges`);

        // If no results
        if (result.length === 0) {
          Log.e("No colleges found");
          return reject("No colleges found");
        }

        // Return the courses
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

export default College;