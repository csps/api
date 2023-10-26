import { ErrorTypes } from "../../types/enums";

import Log from "../../utils/log";
import Database from "../";

/**
 * Course model
 * This model represents the courses table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Course {

  /**
   * Get all courses
   */
  public static getAll(): Promise<Record<string, string>> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Get all env
      db.query(`SELECT * FROM courses ORDER BY name`, [], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no results
        if (results.length === 0) {
          Log.e("No courses found");
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Create courses object
        const courses: Record<string, string> = {};

        // Loop through the results
        for (const result of results) {
          courses[result.id] = result.name;
        }

        // Return the results
        resolve(courses);
      });
    });
  }

  /**
   * Insert new course
   * @param key Course name
   */
  public static insert(name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Check if course key already exists
      db.query("SELECT COUNT(*) AS count FROM courses WHERE `name` = ?", [name], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If course key already exists
        if (results.length > 0 && results[0].count > 0) {
          Log.e(`Course "${name}" already exists!`);
          reject(ErrorTypes.DB_EXIST);
          return;
        }

        // If no error, insert course
        db.query("INSERT INTO courses (`name`) VALUES (?)", [name], (error, results) => {
          // If database error
          if (error) {
            Log.e(error.message);
            reject(ErrorTypes.DB_ERROR);
            return;
          }
    
          // Execute callback without error
          resolve();
        });
      });
    });
  }

  /**
   * Update course
   * @param id Course ID
   * @param name New course name
   */
  public static update(id: string, name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Update course
      db.query("UPDATE courses SET `name` = ? WHERE `id` = ?", [name, id], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no rows affected
        if (results.affectedRows === 0) {
          Log.e(`Update course aborted: id "${id}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Execute callback without error
        resolve();
      });
    });
  }

  /**
   * Delete course
   * @param id Course ID
   */
  public static delete(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Delete the course
      db.query("DELETE FROM courses WHERE `id` = ?", [id], (error, results) => {
        // If database error
        if (error) {
          Log.e(error.message);
          reject(ErrorTypes.DB_ERROR);
          return;
        }

        // If no rows affected
        if (results.affectedRows === 0) {
          Log.e(`Delete course aborted: key "${id}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Execute callback without error
        resolve();
      });
    });
  }

}

export default Course;