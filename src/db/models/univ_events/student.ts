import type { UnivStudentModel } from "../../../types/models";
import type { MariaUpdateResult } from "../../../types";
import { PaginationOutput } from "../../../types/request";
import { ErrorTypes } from "../../../types/enums";

import { isNumber, isEmail, trim, isObjectEmpty } from "../../../utils/string";
import { UnivStudentsColumn } from "../../structure.d.ts";
import { generateToken, hashPassword } from "../../../utils/security";
import { paginationWrapper } from "../../../utils/pagination";

import Database from "../..";
import Log from "../../../utils/log";
import Strings from "../../../config/strings";
import Config from "../../../config";

/**
 * Student model
 * This model represents a student in the database
 * @author TotalElderBerry (Hey)
 */
class UnivStudent {

  /**
   * Get all students
   */
  public static getAll(pagination?: PaginationOutput): Promise<[ UnivStudentModel[], count: number ]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get pagination
        if (pagination && !isObjectEmpty(pagination)) {
          const { query, countQuery, values, countValues } = paginationWrapper(db, {
            query: "SELECT * FROM univ_students ORDER BY id DESC",
            request: pagination
          });

          const mainResult = await db.query<UnivStudentModel[]>(query, values);
          const countResult = await db.query<[{ count: bigint }]>(countQuery, countValues);

          // If no results
          if (mainResult.length === 0) {
            Log.i("No students found");
            return reject(ErrorTypes.DB_EMPTY_RESULT);
          }

          return resolve([mainResult, Number(countResult[0].count) ]);
        }
        
        // Get all students
        const result = await db.query<UnivStudentModel[]>(`SELECT * FROM univ_students ORDER BY id DESC`);

        // If no results
        if (result.length === 0) {
          Log.e("No students found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve([ result, result.length ]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Get student by its student id
   * @param student_id Student ID
   * @param fromAdmin If true, will check in admin table
   */
  public static getByStudentId(student_id: string, fromAdmin = false): Promise<UnivStudentModel> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Query string
        let query = 'SELECT * FROM univ_students WHERE student_id = ?';

        // If getting data from admin
        if (fromAdmin) {
          query = `
            SELECT
              s.id, s.student_id, s.last_name, s.first_name,
              s.year_level, s.email_address, s.password, s.date_stamp, s.course_id
            FROM
              univ_admin a
            INNER JOIN univ_students s ON s.id = a.students_id WHERE s.student_id = ?
          `;
        }

        // Get student
        const result = await db.query<UnivStudentModel[]>(query, [student_id]);
        // If no results
        if (result.length === 0) {
          Log.e(`${fromAdmin ? 'Admin' : 'Student'} not found (id = ${student_id})`);
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve(result[0]);
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
  public static insert(student: UnivStudentModel): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Validate
      const error = UnivStudent.validate(student);

      if (error) {
        return reject(error);
      }

      // Check if student id already exists
      if (await UnivStudent.isExist(UnivStudentsColumn.STUDENT_ID, student.student_id)) {
        Log.i(`Student ID already exists (${student.student_id})`);
        return reject([Strings.STUDENT_ALREADY_EXIST, UnivStudentsColumn.STUDENT_ID]);
      }

      // Check if email already exists
      if (await UnivStudent.isExist(UnivStudentsColumn.EMAIL_ADDRESS, student.email_address)) {
        Log.i(`Student email already exists (${student.email_address})`);
        return reject([Strings.STUDENT_EMAIL_ALREADY_EXIST, UnivStudentsColumn.EMAIL_ADDRESS]);
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
          `INSERT INTO univ_students (student_id, year_level, first_name, last_name, course_id, email_address, password, date_stamp) VALUES (?, ?, ?,?, ?, ?, ?, NOW())`, [
            student.student_id,
            student.year_level,
            student.first_name,
            student.last_name,
            student.course_id,
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
  public static isExist(key: UnivStudentsColumn, value: any): Promise<bigint> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Log
        Log.i(`Checking if student exists (${key} = ${value})`);
        // Get result
        const result = await db.query<[{ count: bigint }]>(
          `SELECT COUNT(*) AS count FROM univ_students WHERE ${key} = ?`, [value]
        );

        // If no results
        // Note: count is a type of bigint
        return resolve(result[0].count);
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
   * @param isUpdate If true, will not check if student id and password
   */
  private static validate(data?: Record<string, any>, isUpdate = false) {
    // Check if data is empty
    if (!data) return [Strings.GENERAL_INVALID_REQUEST];
    // Trim all values
    trim(data);

    if (!isUpdate) {
      // Check if student id is empty
      if (!data.student_id) return [Strings.STUDENT_EMPTY_ID, UnivStudentsColumn.STUDENT_ID];
      // Check if password is empty
      if (!data.password) return [Strings.STUDENT_EMPTY_PASSWORD, UnivStudentsColumn.PASSWORD];
      // Check if student id is a number
      if (!isNumber(data.student_id) || data.student_id.length >= 16) return [Strings.STUDENT_LIMIT_ID, UnivStudentsColumn.STUDENT_ID];
      // Check if email is empty
      if (!data.email_address) return [Strings.STUDENT_EMPTY_EMAIL, UnivStudentsColumn.EMAIL_ADDRESS];
      // Check if email is valid
      if (!isEmail(data.email_address.trim())) return [Strings.STUDENT_INVALID_EMAIL, UnivStudentsColumn.EMAIL_ADDRESS];
    }

    // Check if year level is empty
    if (!data.year_level) return [Strings.STUDENT_EMPTY_YEAR_LEVEL, UnivStudentsColumn.YEAR_LEVEL];
    // Check if first name is empty
    if (!data.first_name) return [Strings.STUDENT_EMPTY_FIRST_NAME, UnivStudentsColumn.FIRST_NAME];
    // Check if last name is empty
    if (!data.last_name) return [Strings.STUDENT_EMPTY_LAST_NAME, UnivStudentsColumn.LAST_NAME];
    // Check if year level is a number and valid
    if (!isNumber(data.year_level) || data.year_level < 1 || data.year_level > 4) return [Strings.STUDENT_LIMIT_YEAR_LEVEL, UnivStudentsColumn.YEAR_LEVEL];
  }
}

export default UnivStudent;