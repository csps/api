import { ErrorTypes } from "../types/enums"
import { sanitize } from "../utils/security";
import Database from "./database"

import {
  Tables,
  StudentColumns,
  ProductColumns,
  EventColumns,
  ProductVariationColumns
} from "./structure";

/**
 * Database Helper
 * @author mavyfaby (Maverick Fabroa)
 */
export class DatabaseHelper {
  /**
   * Check if data exists
   * @param table Table name
   * @param column Column name
   * @param value Value to check
   * @param callback Callback function
   */
  public static isDataExist(table: Tables, column: StudentColumns | ProductColumns | EventColumns | ProductVariationColumns, value: string, callback: (error: ErrorTypes | null, result: boolean) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query(`SELECT COUNT(*) AS count FROM ${sanitize(table)} WHERE ${sanitize(column)} = ?`, [value], (error, results) => {
      // If has error
      if (error) {
        console.error(error);
        callback(ErrorTypes.DB_ERROR, false);
        return;
      }

      // Data exist if results length is greater than 0
      callback(null, results[0].count > 0);
    });
  }
}