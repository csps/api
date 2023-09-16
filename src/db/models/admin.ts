import { ErrorTypes } from "../../types/enums";
import Database from "../database";
import Student from "./student";

/**
 * Admin Model
 * 
 *@author mavyfaby (Maverick G. Fabroa)
 */
export class Admin extends Student {

  /**
   * Get admin from the database
   * @param admin_student_id Student ID
   * @param callback Callback function
   */
  public static fromId(admin_student_id: string, callback: (error: ErrorTypes | null, student: Student | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT s.id, s.student_id, s.last_name, s.first_name, s.year_level, s.email_address, s.password, s.date_stamp  FROM admin a INNER JOIN students s ON s.id = a.students_id WHERE s.student_id = ?", [admin_student_id], (error, results) => {
      // If has error
      if (error) {
        console.error(error);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create and return the student object
      callback(null, new Admin(results[0]));
    });
  }

}