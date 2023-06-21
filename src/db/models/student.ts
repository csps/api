import Database from "../database";
import { ErrorTypes } from "../../types";

/**
 * Student model
 * This model represents a student in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Student {
  private id: number;
  private dbid: number;
  private email: string;
  private firstName: string;
  private lastName: string;
  private yearLevel: string;
  private birthdate: string;

  /**
   * Student Private Constructor
   */
  private constructor(
    id: number,
    dbid: number,
    email: string,
    firstName: string,
    lastName: string,
    yearLevel: string,
    birthdate: string
  ) {
    this.id = id;
    this.dbid = dbid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.yearLevel = yearLevel;
    this.birthdate = birthdate;
  }

  /**
   * Get student from the database using the student ID
   * @param id Student ID
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, student: Student | null, password: string | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM students WHERE student_id = ?", [id], (error, results) => {
      // If has error
      if (error) {
        console.error(error);
        callback(ErrorTypes.DB_ERROR, null, null); // (has error, no results)
        return;
      }

      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null, null); // (has error, no results)
        return;
      }

      // Get result
      const data = results[0];
      // Create student object from data
      const student = new Student(
        // Student ID / Student Number
        data.student_id,
        // Student Primary Key ID
        data.id,
        // Student Email Address
        data.email_address,
        // Student First Name
        data.first_name,
        // Student Last Name
        data.last_name,
        // Student Year Level
        data.year_level,
        // Student Birth Date
        data.birth_date
      );

      // Return student object
      callback(null, student, data.password); // (no errors, student object)
    });
  }
}

export default Student;