import Database from "../..";
import Log from "../../../utils/log";

type AdminData = {
  id: number;
  college_id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

/**
 * UC Days Admin Model
 * @author TotalElderBerry (lala)
 */
class UnivAdmin {
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
          "SELECT s.id, s.student_id, s.last_name, s.first_name, s.year_level, s.email_address, s.password, s.date_stamp, s.course_id, c.college_id, co.acronym, co.name FROM univ_admin a INNER JOIN univ_students s ON s.id = a.univstudents_id inner join colleges_courses c ON c.id = s.course_id inner join colleges co on co.id = c.college_id WHERE s.student_id = ?", [username]
        );

        // If no result or password is incorrect
        if (result.length === 0 || !(await Bun.password.verify(password, result[0].password || ""))) {
          return reject("Username or password is incorrect");
        }

        resolve(result[0]);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(e);
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
          "SELECT s.id, s.student_id, s.last_name, s.first_name, s.year_level, s.email_address, s.password, s.date_stamp, s.course_id, co.acronym, co.name FROM univ_admin a INNER JOIN univ_students s ON s.id = a.univstudents_id inner join colleges_courses c ON c.id = s.course_id inner join colleges co on co.id = c.college_id WHERE s.student_id = ?", [username]
        );
       
        if (result.length === 0) {
          return reject("UC Days Admin not found");
        }

        resolve(result[0]);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(e);
      }
    });
  }
}

export default UnivAdmin;