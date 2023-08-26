import { ErrorTypes } from "../../types/enums";
import { Log } from "../../utils/log";
import Database from "../database";

/**
 * Course model
 * This model represents the courses table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
export class Course {

  /**
   * Get all configurations
   * @param callback Callback function
   */
  public static getAll(callback: (error: ErrorTypes | null, config: object | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Get all configurations
    db.query("SELECT * FROM courses", [], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        Log.e("No courses found!");
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create courses object
      const courses: any = {};

      // Loop through the results
      for (const result of results) {
        courses[result.id] = result.name;
      }

      // Return the results
      callback(null, courses);
    });
  }

  /**
   * Insert new course
   * @param key Course name
   * @param callback Callback function
   */
  public static insert(name: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Check if config key already exists
    db.query("SELECT COUNT(*) AS count FROM courses WHERE `name` = ?", [name], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If config key already exists
      if (results.length > 0 && results[0].count > 0) {
        Log.e(`Course "${name}" already exists!`);
        callback(ErrorTypes.DB_EXIST);
        return;
      }

      // If no error, insert course
      db.query("INSERT INTO courses (`name`) VALUES (?)", [name], (error, results) => {
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
   * Update course
   * @param id Course ID
   * @param name New course name
   * @param callback Callback function
   */
  public static update(id: string, name: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Update course
    db.query("UPDATE courses SET `name` = ? WHERE `id` = ?", [name, id], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Update course aborted: id "${id}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }

  /**
   * Delete course
   * @param id Course ID
   */
  public static delete(id: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Delete the config
    db.query("DELETE FROM courses WHERE `id` = ?", [id], (error, results) => {
      // If database error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // If no rows affected
      if (results.affectedRows === 0) {
        Log.e(`Delete course aborted: key "${id}" not found!`);
        callback(ErrorTypes.DB_EMPTY_RESULT);
        return;
      }

      // Execute callback without error
      callback(null);
    });
  }

}