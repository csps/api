import { ErrorTypes } from "../../types/enums";
import { Log } from "../../utils/log";
import Database from "../database";

/**
 * Config model
 * This model represents the config table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
export class Config {

  /**
   * Get configuration value from key
   * @param key Configuration key
   * @param callback Callback function
   */
  public static fromKey(key: string, callback: (error: ErrorTypes | null, value: string | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    
    // Get configuration value from key
    db.query("SELECT value FROM config WHERE `key` = ?", [key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        Log.e(`Config key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Return the value
      callback(null, results[0].value);
    });
  }

  /**
   * Get all configurations
   * @param callback Callback function
   */
  public static getAll(callback: (error: ErrorTypes | null, config: object | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Get all configurations
    db.query("SELECT * FROM config", [], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        Log.e("No configurations found!");
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create config object
      const config: any = {};

      // Loop through the results
      for (const result of results) {
        config[result.key] = result.value;
      }

      // Return the results
      callback(null, config);
    });
  }

  /**
   * Insert a new configuration
   * @param key Config key
   * @param value Config value
   * @param callback Callback function
   */
  public static insert(key: string, value: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Check if config key already exists
    Config.fromKey(key, (error, value) => {
      // If database error
      if (error === ErrorTypes.DB_ERROR) {
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If config key already exists
      if (value) {
        Log.e(`Config key "${key}" already exists!`);
        callback(ErrorTypes.DB_EXIST);
        return;
      }

      // If no error, insert the config
      db.query("INSERT INTO config (`key`, `value`, date_stamp) VALUES (?, ?, NOW())", [key, value], (error, results) => {
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
   * Update a configuration
   * @param key Config key
   * @param value Config value
   * @param callback Callback function
   */
  public static update(key: string, value: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Update the config
    db.query("UPDATE config SET `value` = ? WHERE `key` = ?", [value, key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Update config aborted: key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }

  /**
   * Delete a configuration
   * @param key Config key
   */
  public static delete(key: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Delete the config
    db.query("DELETE FROM config WHERE `key` = ?", [key], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Delete config aborted: key "${key}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }
}
