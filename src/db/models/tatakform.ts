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

  /**
   * Get by slug name
   */
  public static getBySlug(slug: string): Promise<TatakformModel> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get tatakform by slug
        const result = await db.query<TatakformModel[]>(
          `SELECT * FROM tatakforms WHERE slug = ?`, [slug]
        );

        // If no results
        if (result.length === 0) {
          Log.e("No tatakform found");
          return reject("No tatakform found");
        }

        // Return tatakform
        resolve(result[0]);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
      }
    });
  }
}

export default Tatakform;