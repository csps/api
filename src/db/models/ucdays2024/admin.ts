import Database from "../..";
import Log from "../../../utils/log";

type AdminData = {
  college_id: number;
  username: string;
  password: string;
};

/**
 * UC Days Admin Model
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
          "SELECT * FROM ucdays_accounts WHERE username = ?", [username]
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
          "SELECT * FROM ucdays_accounts WHERE username = ?", [username]
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

export default Admin;