import { Log } from "../../utils/log";
import { getDatestamp } from "../../utils/date";
import { isDate, isEmail, isNumber } from "../../utils/string";
import { ErrorTypes } from "../../types/enums";
import { DatabaseHelper } from "../helper";
import { StudentColumns, Tables } from "../structure";
import Database, { DatabaseModel } from "../database";
import type { StudentType } from "../../types/models";

/**
 * Student model
 * This model represents a student in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Student extends DatabaseModel {
  private id: string;
  private rid?: number;
  private email: string;
  private firstName: string;
  private lastName: string;
  private yearLevel: string;
  private birthdate: string;
  private password?: string;
  private dateStamp?: string;

  /**
   * Student Private Constructor
   * @param data Student data
   */
  public constructor(data: StudentType) {
    super();
    this.id = data.id;
    this.rid = data.rid;
    this.email = data.email.trim();
    this.firstName = data.firstName.trim();
    this.lastName = data.lastName.trim();
    this.yearLevel = data.yearLevel;
    this.birthdate = data.birthdate.trim();
    this.password = data.password;
    this.dateStamp = data.dateStamp;
  }
  
  /**
   * Get student from the database using the student ID
   * @param id Student ID
   * @param callback Callback function
   */
  public static fromId(id: string, callback: (error: ErrorTypes | null, student: Student | null) => void) {
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
        password: data.password,
        // Student Date Stamp
        dateStamp: data.date_stamp
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
        Log.e(error.message);
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
          password: data.password,
          // Student Date Stamp
          dateStamp: data.date_stamp
        });
        
        // Push the student object to the array
        students.push(student);
      }

      // Return the students
      callback(null, students);
    });
  }

  /**
   * Validate student data 
   * @param data Student data
   */
  public static validate(data: any) {
    // Check if student id is empty
    if (!data.id)return ["Student id is required!", "student_id"];
    // Check if year level is empty
    if (!data.yearLevel) return ["Year level is required!", "year_level"];
    // Check if first name is empty
    if (!data.firstName) return ["First name is required!", "first_name"];
    // Check if last name is empty
    if (!data.lastName) return ["Last name is required!", "last_name"];
    // Check if birthdate is empty
    if (!data.birthdate) return ["Birthdate is required!", "birthdate"];
    // Check if email is empty
    if (!data.email) return ["Email is required!", "email"];
    // Check if password is empty
    if (!data.password) return ["Password is required!", "password"];
    // Check if student id is a number
    if (!isNumber(data.id) || data.id.length >= 16) return ["Invalid student id!", "student_id"];
    // Check if year level is a number and valid
    if (!isNumber(data.yearLevel) || data.yearLevel < 1 || data.yearLevel > 4) return ["Invalid year level!", "year_level"];
    // Check if birthdate is valid
    if (!isDate(data.birthdate)) return ["Invalid birthdate!", "birthdate"];
    // Check if email is valid
    if (!isEmail(data.email.trim())) return ["Invalid email address!", "email"];
    // Check if password is at least 8 characters
    if (data.password.trim().length < 8) return ["Password must be at least 8 characters!", "password"];
  }

  /**
   * Insert student data to the database
   * @param student Student data
   * @param callback Callback function
   */
  public static insert(student: StudentType, callback: (error: ErrorTypes | null, student: Student | null) => void) {
    /**
     * Check if the student already exists
     */
    DatabaseHelper.isDataExist(Tables.STUDENTS, StudentColumns.STUDENT_ID, student.id, (error, isFound) => {
      // If has an error
      if (error) {
        callback(error, null);
        return;
      }

      // If student already exists
      if (isFound) {
        callback(ErrorTypes.DB_STUDENT_ALREADY_EXISTS, null);
        return;
      }

      // Check if email already exists
      DatabaseHelper.isDataExist(Tables.STUDENTS, StudentColumns.EMAIL_ADDRESS, student.email.trim(), (error, isFound) => {
        // If has an error
        if (error) {
          callback(error, null);
          return;
        }

        // If email already exists
        if (isFound) {
          callback(ErrorTypes.DB_EMAIL_ALREADY_EXISTS, null);
          return;
        }

        // Get database instance
        const db = Database.getInstance();
        // Get the current date
        const datestamp = getDatestamp();

        // Query the database
        db.query("INSERT INTO students (student_id, email_address, first_name, last_name, year_level, birth_date, password, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
          student.id,
          student.email.trim(),
          student.firstName.trim(),
          student.lastName.trim(),
          student.yearLevel,
          student.birthdate.trim(),
          student.password!.trim(),
          datestamp
        ], (error, results) => {
          // If has an error
          if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR, null);
            return;
          }
    
          // Set the primary key ID
          student.rid = results.insertId;
          // Set the date stamp
          student.dateStamp = datestamp;
    
          // Return the student
          callback(null, new Student(student));
        });
      });
    });
  }

  /**
   * Get student ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get primary key ID
   */
  public getRid() {
    return this.rid || -1;
  }

  /**
   * Get email address
   */
  public getEmail() {
    return this.email;
  }

  /**
   * Get first name
   */
  public getFirstName() {
    return this.firstName;
  }

  /**
   * Get last name
   */
  public getLastName() {
    return this.lastName;
  }

  /**
   * Get year level
   */
  public getYearLevel() {
    return this.yearLevel;
  }

  /**
   * Get birthdate
   */
  public getBirthdate() {
    return this.birthdate;
  }

  /**
   * Get student password
   */
  public getPassword() {
    return this.password || "";
  }
}

export default Student;