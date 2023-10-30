import type { StudentModel } from "../../types/models";
import { ErrorTypes } from "../../types/enums";

import Database from "..";
import Log from "../../utils/log";

/**
 * Student model
 * This model represents a student in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Student {

  /**
   * Get all events
   */
  public static getAll(): Promise<StudentModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all events
        const result = await db.query<StudentModel[]>(`SELECT * FROM students ORDER BY id DESC`);

        // If no results
        if (result.length === 0) {
          Log.e("No students found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve(result);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

}

export default Student;