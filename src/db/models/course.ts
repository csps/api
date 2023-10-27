import { ErrorTypes } from "../../types/enums";

import { CourseModel } from "../../types/models";
import { MariaUpdateResult } from "../../types";

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

      try {
        // Get all courses
        const result = await db.query<CourseModel[]>(`SELECT * FROM courses ORDER BY name`);

        // If no results
        if (result.length === 0) {
          Log.e("No courses found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Create courses object
        const courses: Record<string, string> = {};

        // Loop through the result
        for (const course of result) {
          courses[course.id] = course.name;
        }

        // Return the courses
        resolve(courses);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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
      try {
        // Get course count
        const result = await db.query<[{ count: number }]>("SELECT COUNT(*) AS count FROM courses WHERE `name` = ?`", [name]);

        // If course key already exists
        if (result[0].count > 0) {
          Log.e(`Course "${name}" already exists!`);
          return reject(ErrorTypes.DB_EXIST);
        }

        // If no error, insert course
        await db.query("INSERT INTO courses (`name`) VALUES (?)", [name]);
        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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

      // Check if course key already exists
      try {
        // Get course count
        const result = await db.query<[{ count: number }]>("SELECT COUNT(*) AS count FROM courses WHERE `id` = ?", [name, id]);

        // If course key already exists
        if (result[0].count === 0) {
          Log.e(`Course with ID "${id}" doesn't exists!`);
          return reject(ErrorTypes.DB_EXIST);
        }

        // If no error, insert course
        const updateResult = await db.query<MariaUpdateResult>("UPDATE courses SET `name` = ? WHERE `id` = ?", [name, id]);

        // If no rows affected
        if (updateResult.affectedRows === 0) {
          Log.e(`Update course aborted: id "${id}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
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
      try {
        // Delete course
        const result = await db.query<MariaUpdateResult>("DELETE FROM courses WHERE `id` = ?", [id]);

        // If no rows affected
        if (result.affectedRows === 0) {
          Log.e(`Delete course aborted: key "${id}" not found!`);
          reject(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // Resolve promise
        resolve();
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

}

export default Course;