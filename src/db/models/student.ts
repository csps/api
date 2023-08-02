import type { StudentType } from "../../types/models";
import Database, { DatabaseModel } from "../database";
import { StudentColumns, Tables } from "../structure";

import { getDatestamp } from "../../utils/date";
import { isDate, isEmail, isNumber } from "../../utils/string";
import { ErrorTypes, Strings } from "../../types/enums";
import { DatabaseHelper } from "../helper";
import { Log } from "../../utils/log";

import bcrypt from "bcrypt";

/**
 * Student model
 * This model represents a student in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Student extends DatabaseModel {
  private id: number;
  private student_id: string;
  private last_name: string;
  private first_name: string;
  private year_level: string;
  private email_address: string;
  private birth_date: string;
  private password?: string;
  private date_stamp?: string;

  /**
   * Student Private Constructor
   * @param data Student data
   */
  public constructor(data: StudentType) {
    super();
    this.id = data.id;
    this.student_id = data.student_id;
    this.last_name = data.last_name;
    this.first_name = data.first_name;
    this.year_level = data.year_level;
    this.email_address = data.email_address;
    this.birth_date = data.birth_date;
    this.password = data.password;
    this.date_stamp = data.date_stamp;
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

      // Create and return the student object
      callback(null, new Student(results[0]));
    });
  }

  /**
   * Get student from the database using the unique ID
   * @param uid Unique ID
   * @param callback Callback function
   */
  public static fromUniqueId(uid: string, callback: (error: ErrorTypes | null, student: Student | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM students WHERE id = ?", [uid], (error, results) => {
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
      callback(null, new Student(results[0]));
    });
  }

  /**
   * Get student from reset token
   * @param token Reset token
   * @param callback Callback function
   */
  public static fromResetToken(token: string, callback: (error:  ErrorTypes | null, student: Student | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT *, r.date_stamp AS token_date_stamp FROM students s INNER JOIN reset_password_tokens r ON s.id = r.students_id WHERE r.token = ? LIMIT 1", [token], (error, results) => {
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

      // If token is used
      if (results[0].is_used === 1) {
        callback(ErrorTypes.DB_USED, null);
        return;
      }

      // Check if token is expired
      if ((new Date().getTime() - new Date(results[0].token_date_stamp).getTime()) >= parseInt(Strings.TOKEN_EXPIRY) * 60 * 1000) {
        callback(ErrorTypes.DB_EXPIRED, null);
        return;
      }

      // Create and return the student object
      callback(null, new Student(results[0]));
    });
  }

  /**
   * Get Product list from the database 
   * @param callback 
   */
  public static getAll(callback: (error: ErrorTypes | null, student: Student[] | null) => void) {
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

      // Create and return the students
      callback(null, results.map((student: StudentType) => new Student(student)));
    });
  }

  /**
   * Validate student data 
   * @param data Student data
   */
  public static validate(data: any) {
    // Check if student id is empty
    if (!data.id) return [Strings.STUDENT_EMPTY_ID, "student_id"];
    // Check if year level is empty
    if (!data.yearLevel) return [Strings.STUDENT_EMPTY_YEAR_LEVEL, "year_level"];
    // Check if first name is empty
    if (!data.firstName) return [Strings.STUDENT_EMPTY_FIRST_NAME, "first_name"];
    // Check if last name is empty
    if (!data.lastName) return [Strings.STUDENT_EMPTY_LAST_NAME, "last_name"];
    // Check if birthdate is empty
    if (!data.birthdate) return [Strings.STUDENT_EMPTY_BIRTHDATE, "birthdate"];
    // Check if email is empty
    if (!data.email) return [Strings.STUDENT_EMPTY_EMAIL, "email"];
    // Check if password is empty
    if (!data.password) return [Strings.STUDENT_EMPTY_PASSWORD, "password"];
    // Check if student id is a number
    if (!isNumber(data.id) || data.id.length >= 16) return [Strings.STUDENT_LIMIT_ID, "student_id"];
    // Check if year level is a number and valid
    if (!isNumber(data.yearLevel) || data.yearLevel < 1 || data.yearLevel > 4) return [Strings.STUDENT_LIMIT_YEAR_LEVEL, "year_level"];
    // Check if birthdate is valid
    if (!isDate(data.birthdate)) return [Strings.STUDENT_INVALID_BIRTHDATE, "birthdate"];
    // Check if email is valid
    if (!isEmail(data.email.trim())) return [Strings.STUDENT_INVALID_EMAIL, "email"];
    // Check if password is at least 8 characters
    if (data.password.trim().length < 8) return [Strings.STUDENT_INVALID_PASSWORD, "password"];
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
    DatabaseHelper.isDataExist(Tables.STUDENTS, StudentColumns.STUDENT_ID, student.student_id, (error, isFound) => {
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
      DatabaseHelper.isDataExist(Tables.STUDENTS, StudentColumns.EMAIL_ADDRESS, student.email_address.trim(), (error, isFound) => {
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
        db.query("INSERT INTO students (student_id, last_name, first_name, year_level, email_address, birth_date, password, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
          student.student_id,
          student.last_name.trim(),
          student.first_name.trim(),
          student.year_level,
          student.email_address.trim(),
          student.birth_date.trim(),
          student.password?.trim(),
          datestamp
        ], (error, results) => {
          // If has an error
          if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR, null);
            return;
          }
    
          // Set the primary key ID
          student.id = results.insertId;
          // Set the date stamp
          student.date_stamp = datestamp;
    
          // Return the student
          callback(null, new Student(student));
        });
      });
    });
  }

  /**
   * Add reset token to the database
   * @param token Reset Token
   * @param callback Callback function
   */
  public addResetToken(token: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("INSERT INTO reset_password_tokens (students_id, token, is_used, date_stamp) VALUES (?, ?, 0, NOW())", [this.id, token], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR);
        return;
      }

      // Log message
      Log.i(`Reset password token added to database for ${this.getFullname()} (${this.student_id})`);
      // Return success
      callback(null);
    });
  }

  /**
   * Reset password
   * @param token Reset token
   * @param new_password New password
   * @param callback callback
   */
  public resetPassword(token: string, new_password: string, callback: (error: ErrorTypes | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Hash the new password
    bcrypt.hash(new_password, 10, (error, hash) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.HASH_ERROR);
        return;
      }

      // Check if reset password token is used
      db.query(`SELECT date_stamp, is_used FROM reset_password_tokens WHERE token = ?`, [token], (error, results) => {
        // If has an error
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR);
          return;
        }

        // If token not found
        if (results.length === 0) {
          callback(ErrorTypes.DB_EMPTY_RESULT);
          return;
        }

        // If token is used
        if (results[0].is_used === 1) {
          callback(ErrorTypes.DB_USED);
          return;
        }

        // Check if token is expired
        if ((new Date().getTime() - new Date(results[0].date_stamp).getTime()) >= parseInt(Strings.TOKEN_EXPIRY) * 60 * 1000) {
          callback(ErrorTypes.DB_EXPIRED);
          return;
        }

        // Query the database
        db.query("UPDATE students SET password = ? WHERE id = ?", [hash, this.id], (error, results) => {
          // If has an error
          if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR);
            return;
          }
  
          // Query the database
          db.query("UPDATE reset_password_tokens SET is_used = 1, reset_date_stamp = NOW() WHERE token = ?", [token], (error, results) => {
            // If has an error
            if (error) {
              Log.e(error.message);
              callback(ErrorTypes.DB_ERROR);
              return;
            }
  
            // Return success
            callback(null);
          });
        });
      });
    });
  }

  /**
   * Get unique ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get primary key ID
   */
  public getStudentId() {
    return this.student_id;
  }

  /**
   * Get email address
   */
  public getEmailAddress() {
    return this.email_address;
  }

  /**
   * Get first name
   */
  public getFirstName() {
    return this.first_name;
  }

  /**
   * Get last name
   */
  public getLastName() {
    return this.last_name;
  }

  /**
   * Get full name
   */
  public getFullname() {
    return `${this.first_name} ${this.last_name}`;
  }

  /**
   * Get email credential
   */
  public getEmailCredential() {
    return `${this.first_name} ${this.last_name} <${this.email_address}>`;
  }

  /**
   * Get year level
   */
  public getYearLevel() {
    return this.year_level;
  }

  /**
   * Get birthdate
   */
  public getBirthdate() {
    return this.birth_date;
  }

  /**
   * Get date stamp
   */
  public getDatestamp() {
    return this.date_stamp;
  }

  /**
   * Get student password
   */
  public getPassword() {
    return this.password || "";
  }
}

export default Student;