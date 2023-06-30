import Database from "../database";
import { DatabaseModel, ErrorTypes } from "../../types";
import type { StudentType } from "../../types/models";

/**
 * Student model
 * This model represents a student in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Student extends DatabaseModel {
  private id: number;
  private rid?: number;
  private email: string;
  private firstName: string;
  private lastName: string;
  private yearLevel: string;
  private birthdate: string;
  private password?: string;

  /**
   * Student Private Constructor
   * @param data Student data
   */
  private constructor(data: StudentType) {
    super();
    this.id = data.id;
    this.rid = data.rid;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.yearLevel = data.yearLevel;
    this.birthdate = data.birthdate;
    this.password = data.password;
  }
  
  /**
   * Get student from the database using the student ID
   * @param id Student ID
   * @param callback Callback function
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, student: Student | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM students WHERE student_id = ?", [id], (error, results) => {
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

      // Get result
      const data = results[0];
      // Create Student object
      const student = new Student({
        // Student ID / Student Number
        id: data.student_id,
        // Student Primary Key ID
        rid: data.id,
        // Student Email Address
        email: data.email_address,
        // Student First Name
        firstName: data.first_name,
        // Student Last Name
        lastName: data.last_name,
        // Student Year Level
        yearLevel: data.year_level,
        // Student Birth Date
        birthdate: data.birth_date,
        // Student password
        password: data.password
      });

      // Return student object
      callback(null, student);
    });
  }

  /**
   * Get Product list from the database 
   * @param callback 
   */
  public static getAll(callback: (error: ErrorTypes | null, product: Student[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query('SELECT * FROM students', [], (error, results) => {
      // If has an error
      if (error) {
        console.log(error);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }
      
      // If no results
      if (results.length === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, null);
        return;
      }

      // Create Students
      const students: Student[] = [];

      // Loop through the results
      for (const data of results) {
        // Create Student object
        const student = new Student({
          // Student ID / Student Number
          id: data.student_id,
          // Student Primary Key ID
          rid: data.id,
          // Student Email Address
          email: data.email_address,
          // Student First Name
          firstName: data.first_name,
          // Student Last Name
          lastName: data.last_name,
          // Student Year Level
          yearLevel: data.year_level,
          // Student Birth Date
          birthdate: data.birth_date,
          // Student password
          password: data.password
        });
        
        // Push the student object to the array
        students.push(student);
      }

      // Return the students
      callback(null, students);
    });
  }

  /**
   * Get student password
   */
  public getPassword() {
    return this.password || "";
  }
}

export default Student;