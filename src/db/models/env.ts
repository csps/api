import { ErrorTypes } from "../../types/enums";
import { Log } from "../../utils/log";
import Database from "../database";

/**
 * Env model
 * This model represents the env table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
export class Env {

  /**
   * Get env value from key
   * @param key env key
   * @param callback Callback function
   */
  public static fromKey(key: string, callback: (error: ErrorTypes | null, value: string | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    
    // Get env value from key
    db.query("SELECT value FROM env WHERE `key` = ?", [key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        Log.e(`Env key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Return the value
      callback(null, results[0].value);
    });
  }

  /**
   * Get all env
   * @param callback Callback function
   */
  public static getAll(callback: (error: ErrorTypes | null, env: object | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Get all env
    db.query("SELECT * FROM env", [], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        Log.e("No environment variables found!");
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create env object
      const env: any = {};

      // Loop through the results
      for (const result of results) {
        env[result.key] = result.value;
      }

      // Return the results
      callback(null, env);
    });
  }

  /**
   * Insert new env
   * @param key Env key
   * @param value Env value
   * @param callback Callback function
   */
  public static insert(key: string, value: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Check if env key already exists
    Env.fromKey(key, (error, value) => {
      // If database error
      if (error === ErrorTypes.DB_ERROR) {
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If env key already exists
      if (value) {
        Log.e(`Env key "${key}" already exists!`);
        callback(ErrorTypes.DB_EXIST);
        return;
      }

      // If no error, insert the env
      db.query("INSERT INTO env (`key`, `value`, date_stamp) VALUES (?, ?, NOW())", [key, value], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR);
          return;
        }
  
        // Execute callback without error
        callback(null);
      });
    });
  }

  /**
   * Update env
   * @param key Env key
   * @param value Env value
   * @param callback Callback function
   */
  public static update(key: string, value: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Update env
    db.query("UPDATE env SET `value` = ? WHERE `key` = ?", [value, key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Update env aborted: key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }

  /**
   * Delete env
   * @param key Env key
   */
  public static delete(key: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Delete env
    db.query("DELETE FROM env WHERE `key` = ?", [key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Delete env aborted: key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }
}
