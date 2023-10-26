import { ErrorTypes } from "../../types/enums";
import Log from "../../utils/log";
import Database from "../";

/**
 * Env model
 * This model represents the env table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Env {
  /**
   * Get env value from key
   * @param key env key
   */
  public static fromKey(key: string, fromInsert?: boolean): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Get env value from key
      db.query("SELECT value FROM env WHERE `key` = ?", [key], (error, results) => {
        if (error) {
          Log.e(`Error while getting env value from key: ${error.message}`);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        if (results.length === 0) {
          if (!fromInsert) {
            Log.e(`No env value found from key: ${key}`);
          }

          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        resolve(results[0].value);
      });
    });
  }

  /**
   * Get all env
   */
  public static getAll(): Promise<Record<string, string>> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Get all env
      db.query("SELECT * FROM env ORDER BY `key` ASC", [], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no results
        if (results.length === 0) {
          Log.e("No environment variables found!");
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Create env object
        const env: Record<string, string> = {};

        // Loop through the results
        for (const result of results) {
          env[result.key] = result.value;
        }

        // Return the results
        resolve(env);
      });
    });
  }

   /**
   * Insert new env
   * @param key Env key
   * @param value Env value
   */
   public static insert(key: string, value: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Check if env key already exists
        await Env.fromKey(key, true);
        // If no error, env key already exists
        Log.e(`Env key "${key}" already exists!`);
        // Reject with error
        reject(ErrorTypes.DB_EXIST);
      }
      
      catch (err) {
        // If database error
        if (err === ErrorTypes.DB_ERROR) {
          Log.e(`Error while checking if env key already exists: ${key}`);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no result
        if (err === ErrorTypes.DB_EMPTY_RESULT) {
          // If no error, insert the env
          db.query("INSERT INTO env (`key`, `value`, date_stamp) VALUES (?, ?, NOW())", [key, value], (error, results) => {
            // If database error
            if (error) {
              Log.e(error.message);
              reject(ErrorTypes.DB_ERROR);
              return;
            }
      
            // Resolve without error
            resolve();
          });
        }
      }
    });
  }

  /**
   * Update env
   * @param key Env key
   * @param value Env value
   */
  public static update(key: string, value: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Update env
      db.query("UPDATE env SET `value` = ? WHERE `key` = ?", [value, key], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no rows affected
        if (results.affectedRows === 0) {
          Log.e(`Update env aborted: key "${key}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve without error
        resolve();
      });
    });
  }

  /**
   * Delete env
   * @param key Env key
   */
  public static delete(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Delete env
      db.query("DELETE FROM env WHERE `key` = ?", [key], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no rows affected
        if (results.affectedRows === 0) {
          Log.e(`Delete env aborted: key "${key}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve without error
        resolve();
      });
    });
  }
}

export default Env;