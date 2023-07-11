import mysql from "mysql";
import { sanitizeArray } from "../utils/security";
import { ErrorTypes } from "../types/enums";

/**
 * Database Model class
 */
export abstract class DatabaseModel {
  static fromId(id: number | string, callback: (error: ErrorTypes | null, product: DatabaseModel | null) => void) {
    throw new Error("Method not implemented.");
  }

  static getAll(callback: (error: ErrorTypes | null, product: DatabaseModel[] | null) => void) {
    throw new Error("Method not implemented.");
  }
}

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
   */
  private constructor() {
    Database.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      dateStrings: true
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
   * Query the database 
   * @param query SQL query
   * @param values Parameter values
   * @param callback Callback function (error, results)
   */
  public query(query: string, values: any[], callback: (error: mysql.MysqlError | null, results: any) => void) {
    return Database.pool.query(query, sanitizeArray(values), callback);
  }
}

export default Database;