import { ErrorTypes } from "../../../types/enums";
import Log from "../../../utils/log";
import Database from "../..";
import { ICTStudentModel, ICTStudentRegisterModel } from "../../../types/models";
import { PaginationOutput } from "../../../types/request";
import { isEmail, isObjectEmpty } from "../../../utils/string";
import { paginationWrapper } from "../../../utils/pagination";
import { MariaUpdateResult } from "../../../types";

type AdminData = {
  campus: string;
  campus_id: number;
  campus_name: string;
  username: string;
  password: string;
};

/**
 * ICT Congress Admin Model
 * @author mavyfaby (Maverick G. Fabroa)
 */
class Admin {
  /**
   * Get by username and password
   */
  public static getByUsernameAndPassword(username: string, password: string): Promise<AdminData> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get admin by username and password
        const result = await db.query<AdminData[]>(
          "SELECT c.campus, c.campus_name, s.* FROM ict2024_accounts s INNER JOIN ict2024_campus c ON s.campus_id = c.id WHERE s.username = ? LIMIT 1", [username]
        );

        if (result.length === 0) {
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // If password is incorrect
        if (!(await Bun.password.verify(password, result[0].password || ""))) {
          return reject(ErrorTypes.UNAUTHORIZED);
        }

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
   * Get by username
   */
  public static getByUsername(username: string): Promise<AdminData> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get admin by username
        const result = await db.query<AdminData[]>(
          "SELECT c.campus, c.campus_name, s.* FROM ict2024_accounts s INNER JOIN ict2024_campus c ON c.id = s.campus_id WHERE s.username = ? LIMIT 1", [
            username
          ]
        );

        if (result.length === 0) {
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

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
   * Search
   * @param campus_id Campus
   * @param search Search
   */
  public static searchStudents(campus_id: number, pagination?: PaginationOutput): Promise<[ICTStudentModel[], count: number]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get pagination
        if (pagination && !isObjectEmpty(pagination)) {
          const { query, countQuery, values, countValues } = paginationWrapper(db, {
            query: `
              SELECT s.*, ts.name as tshirt_size, c.course_name as course FROM ict2024_students s
              INNER JOIN ict2024_tshirt_sizes ts ON s.tshirt_size_id = ts.id
              INNER JOIN ict2024_courses c ON s.course_id = c.id
              WHERE s.campus_id = ${db.escape(campus_id)}
            `,
            request: pagination
          });

          // Get students
          const students = await db.query<ICTStudentModel[]>(query, values);
          const count = await db.query<[{ count: bigint }]>(countQuery, countValues);

          // If no students found
          if (students.length === 0) {
            // Log.i(`[ICT Congress 2024] No students found in the "${pagination}".`);
            return reject(ErrorTypes.DB_EMPTY_RESULT);
          }

          resolve([students, Number(count[0].count) ]);
        }
      }

      // Log error and reject promise
      catch (e) {
        console.error(e);
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Register student
   */
  public static registerStudent(student: ICTStudentRegisterModel): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Check for student ID
        let results = await db.query<ICTStudentModel[]>("SELECT * FROM ict2024_students WHERE student_id = ? LIMIT 1", [ student.student_id ]);

        // If student exists
        if (results.length > 0) {
          return reject("Student ID already registered.");
        }

        // Validate email
        if (!isEmail(student.email)) {
          return reject("Invalid email format.");
        }

        // Check for email
        results = await db.query<ICTStudentModel[]>("SELECT * FROM ict2024_students WHERE email = ? LIMIT 1", [ student.email ]);

        // If email exists
        if (results.length > 0) {
          return reject("Email already registered.");
        }

        // Register student
        await db.query(`
          INSERT INTO ict2024_students (
            campus_id, student_id, course_id, tshirt_size_id, year_level,
            first_name, last_name, email, snack_claimed, date_stamp
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW()
          )`, [
          student.campus_id,
          student.student_id,
          student.course_id,
          student.tshirt_size_id,
          student.year_level,
          student.first_name,
          student.last_name,
          student.email
        ]);

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
   * Confirm payment
   * @param student_id Student ID
   */
  public static confirmPaymentByStudentID(student_id: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Confirm student
        await db.query("UPDATE ict2024_students SET payment_confirmed = NOW() WHERE student_id = ?", [ student_id ]);
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
   * Mark student as present for the event
   * @param student_id Student ID
   */
  public static markStudentAsPresent(student_id: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Mark student as present
        const result = await db.query<MariaUpdateResult>(
          "UPDATE ict2024_students SET attendance = NOW() WHERE student_id = ?", [ student_id ]
        );
        
        // If student successfully marked as present
        if (result.affectedRows > 0) {
          return resolve();
        }

        // If student ID not found
        reject("Student ID is not registered!");
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Claim snack by student ID
   * @param student_id Student ID
   */
  public static claimSnackByStudentID(student_id: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Claim snack
        const result = await db.query<MariaUpdateResult>(
          "UPDATE ict2024_students SET snack_claimed = 1 WHERE student_id = ?", [ student_id ]
        );
        
        // If snack successfully claimed
        if (result.affectedRows > 0) {
          return resolve();
        }

        // If student ID not found
        reject("Student ID is not registered!");
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
  
  /**
   * Get courses
   */
  public static getCourses(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Get courses
        const courses = await db.query("SELECT * FROM ict2024_courses");
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
   * Get campuses
   */
  public static getCampuses(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Get campuses
        const campuses = await db.query("SELECT * FROM ict2024_campus");
        resolve(campuses);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Get t-shirt sizes
   */
  public static getTShirtSizes(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Get t-shirt sizes
        const tshirtSizes = await db.query("SELECT * FROM ict2024_tshirt_sizes");
        resolve(tshirtSizes);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
}
export default Admin;