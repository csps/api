import { ErrorTypes } from "../../../types/enums";
import Log from "../../../utils/log";
import Database from "../..";
import { ICTStudentModel } from "../../../types/models";
import { PaginationOutput } from "../../../types/request";
import { isObjectEmpty } from "../../../utils/string";
import { paginationWrapper } from "../../../utils/pagination";

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
            query: `SELECT * FROM ict2024_students WHERE campus_id = ${db.escape(campus_id)}`,
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
   * Confirm student
   * @param student_id Student ID
   */
  public static confirmStudent(student_id: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = Database.getInstance();

      try {
        // Confirm student
        await db.query("UPDATE ict2024_students SET order_confirmed = NOW() WHERE student_id = ?", [ student_id ]);
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
export default Admin;