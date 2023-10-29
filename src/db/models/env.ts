import { ErrorTypes } from "../../types/enums";
import { MariaUpdateResult } from "../../types";

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
      try {
        // Get env value from key
        const result = await db.query<{ value: string }[]>("SELECT value FROM env WHERE `key` = ?", [key]);

        // If no results
        if (result.length === 0) {
          if (!fromInsert) {
            Log.e(`No env value found from key: ${key}`);
          }

          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        resolve(result[0].value);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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
      try {
        // Get all env
        const result = await db.query<{ key: string, value: string }[]>("SELECT * FROM env ORDER BY `key` ASC");

        // If no results
        if (result.length === 0) {
          Log.e("No environment variables found!");
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Create env object
        const envs: Record<string, string> = {};

        // Loop through the results
        for (const env of result) {
          envs[env.key] = env.value;
        }

        // Return the results
        resolve(envs);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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
          try {
            // Insert new env
            await db.query("INSERT INTO env (`key`, `value`, date_stamp) VALUES (?, ?, NOW())", [key, value]);
            // Resolve without error
            resolve();
          }

          catch (e) {
            // If database error
            Log.e(e);
            reject(ErrorTypes.DB_ERROR);
          }
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

      try {
        // Check if env key already exists
        const result = await db.query<MariaUpdateResult>("UPDATE env SET `value` = ? WHERE `key` = ?", [value, key]);

        // If no rows affected
        if (result.affectedRows === 0) {
          Log.e(`Update env aborted: key "${key}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve promise
        resolve();
      }

      catch (e) {
        // If database error
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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

      try {
        // Check if env key already exists
        const result = await db.query<MariaUpdateResult>("DELETE FROM env WHERE `key` = ?", [key]);

        // If no rows affected
        if (result.affectedRows === 0) {
          Log.e(`Delete env aborted: key "${key}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve promise
        resolve();
      }

      catch (e) {
        // If database error
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
}

export default Env;