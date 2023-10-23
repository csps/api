import { ErrorTypes } from "../types/enums"
import { EditLogsModel } from "../types/models";
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

  /**
   * Save edit logs
   * @param data 
   */
  public static saveLog(data: EditLogsModel) {
    // Query the database
    Database.getInstance().query(`
      INSERT INTO ${Tables.EDIT_LOGS} (admin_id, method, \`table\`,  \`before\`, \`after\`, ip_address, date_stamp) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [ data.admin_id, data.method, data.table, data.before, data.after, data.ip_address ],
    (error) => {
      // If has error
      if (error) {
        console.error(error);
      }
    });
  }
}