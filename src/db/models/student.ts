import type { StudentModel } from "../../types/models";
import type { MariaUpdateResult } from "../../types";
import { ErrorTypes } from "../../types/enums";

import { isNumber, isEmail, trim } from "../../utils/string";
import { StudentColumns } from "../structure";
import { hashPassword } from "../../utils/security";

import Database from "..";
import Log from "../../utils/log";
import Strings from "../../config/strings";

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

  /**
   * Insert student data to the database
   * @param student Student data
   */
  public static insert(student: StudentModel): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = Student.validate(student);

      if (error) {
        return reject(error);
      }

      // Check if student id already exists
      if (await Student.isExist(StudentColumns.STUDENT_ID, student.student_id)) {
        Log.i(`Student ID already exists (${student.student_id})`);
        return reject([Strings.STUDENT_ALREADY_EXIST, StudentColumns.STUDENT_ID]);
      }

      // Check if email already exists
      if (await Student.isExist(StudentColumns.EMAIL_ADDRESS, student.email_address)) {
        Log.i(`Student email already exists (${student.email_address})`);
        return reject([Strings.STUDENT_EMAIL_ALREADY_EXIST, StudentColumns.EMAIL_ADDRESS]);
      }

      // Log inserting student
      Log.i(`Inserting student (${student.first_name} ${student.last_name} - ${student.student_id})`);

      try {
        // Get database pool connection
        const db = Database.getInstance();
        // Hash password with bcrypt algorithm
        const hash = await hashPassword(student.password || "");
  
        // Insert student
        const result = await db.query<MariaUpdateResult>(
          `INSERT INTO students (student_id, year_level, first_name, last_name, email_address, password, date_stamp) VALUES (?, ?, ?, ?, ?, ?, NOW())`, [
            student.student_id,
            student.year_level,
            student.first_name,
            student.last_name,
            student.email_address,
            hash
          ]
        );
  
        // If no affected rows
        if (result.affectedRows === 0) {
          Log.e("Student Insert Failed: No rows affected");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }
  
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
   * Check whether a student exists
   * @param key Student column
   * @param value Value to check
   */
  public static isExist(key: StudentColumns, value: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Log
        Log.i(`Checking if student exists (${key} = ${value})`);
        // Get result
        const result = await db.query<[{ count: number }]>(
          `SELECT COUNT(*) AS count FROM students WHERE ${key} = ?`, [value]
        );

        // If no results
        // Using "==" because result[0].count is a type of BIGINT
        if (result[0].count == 0) {
          return resolve(false);
        }

        // Resolve promise
        resolve(true);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Validate student data 
   * @param data Student data
   */
  private static validate(data?: Record<string, any>) {
    // Check if data is empty
    if (!data) return [Strings.GENERAL_INVALID_REQUEST];

    // Trim all values
    trim(data);

    // Check if student id is empty
    if (!data.student_id) return [Strings.STUDENT_EMPTY_ID, StudentColumns.STUDENT_ID];
    // Check if year level is empty
    if (!data.year_level) return [Strings.STUDENT_EMPTY_YEAR_LEVEL, StudentColumns.YEAR_LEVEL];
    // Check if first name is empty
    if (!data.first_name) return [Strings.STUDENT_EMPTY_FIRST_NAME, StudentColumns.FIRST_NAME];
    // Check if last name is empty
    if (!data.last_name) return [Strings.STUDENT_EMPTY_LAST_NAME, StudentColumns.LAST_NAME];
    // Check if email is empty
    if (!data.email_address) return [Strings.STUDENT_EMPTY_EMAIL, StudentColumns.EMAIL_ADDRESS];
    // Check if password is empty
    if (!data.password) return [Strings.STUDENT_EMPTY_PASSWORD, StudentColumns.PASSWORD];
    // Check if student id is a number
    if (!isNumber(data.student_id) || data.student_id.length >= 16) return [Strings.STUDENT_LIMIT_ID, StudentColumns.STUDENT_ID];
    // Check if year level is a number and valid
    if (!isNumber(data.year_level) || data.year_level < 1 || data.year_level > 4) return [Strings.STUDENT_LIMIT_YEAR_LEVEL, StudentColumns.YEAR_LEVEL];
    // Check if email is valid
    if (!isEmail(data.email_address.trim())) return [Strings.STUDENT_INVALID_EMAIL, StudentColumns.EMAIL_ADDRESS];
  }
}

export default Student;