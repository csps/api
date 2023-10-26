import mysql from "mysql";

/**
 * Singleton Database class
 * 
 * Create a .env file in the root directory of the project
 * and add the following variables:
 * 
 * DB_HOST=database_host
 * DB_USER=database_user
 * DB_PASS=database_password
 * DB_NAME=database_name
 * 
 * @author mavyfaby (Maverick Fabroa)
 */
class Database {
  private static instance: Database;
  private static pool: mysql.Pool;

  /**
   * Create a database connection pool
   * 
   * Database connection pool is used to reuse connections instead of creating a new one.
   * This is more efficient and faster than creating a new connection every time.
   */
  private constructor() {
    Database.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      dateStrings: true,
      port: 3306
    });
  }

  /**
   * Get the instance of the database class
   */
  public static getInstance(): Database {
    // If instance is not yet created
    if (!Database.instance) {
      // Create a new instance
      Database.instance = new Database();
    }

    // Return the instance
    return Database.instance;
  }

  /**
   * Get the database connection
   */
  public static getConnection(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      Database.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }

        resolve(connection);
      });
    });
  }

  /**
   * Query the database 
   * @param query SQL query
   * @param values Parameter values
   * @param callback Callback function (error, results)
   */
  public query(query: string, values: any[], callback: (error: mysql.MysqlError | null, results: any) => void) {
    return Database.pool.query(query, values, callback);
  }
}

export default Database;