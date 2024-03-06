import chalk from "chalk";
import Elysia from "elysia";
import { ip } from "elysia-ip";

import { ElysiaContext, MariaUpdateResult } from "../types";
import { getDatestamp } from "./date";
import Database from "../db";
import { LoginLogModel } from "../types/models";
import { AuthType } from "../types/enums";

/**
 * Custom logging event for CSPS Web App API
 * @author mavyfaby (Maverick Fabroa)
 */
class Log {
  /**
   * Show error log
   * @param message Error message to log
   * @param highlight Highlight the log
   */
  static e(message: any, highlight?: boolean) {
    console.log(chalk.bgRed("[-]") + " " + (highlight ? chalk.bgRed(message) : chalk.red(message)));
  }

  /**
   * Show success log
   * @param message Success message to log
   * @param highlight Highlight the log
   */
  static s(message: any, highlight?: boolean) {
    console.log(chalk.bgGreen("[+]") + " " + (highlight ? chalk.bgGreen(message) : chalk.green(message)));
  }

  /**
   * Show warning log
   * @param message Warning message to log
   * @param highlight Highlight the log
   */
  static w(message: any, highlight?: boolean) {
    console.log(chalk.bgYellow("[!]") + " " + (highlight ? chalk.bgYellow(message) : chalk.yellow(message)));
  }

  /**
   * Show info log
   * @param message Info message to log
   * @param highlight Highlight the log
   */
  static i(message: any, highlight?: boolean) {
    console.log(chalk.bgBlue("[*]") + " " + (highlight ? chalk.bgBlue(message) : chalk.blue(message)));
  }

  /**
   * 
   * @param app 
   */
  static extend(app: Elysia) {
    app.use(ip()).on("afterHandle", (context: any) => {
      Log.response(context);
    });
  }

  /**
   * Show response log information
   * @param request 
   * @param response 
   */
  static response(context: ElysiaContext) {
    // Get the method, URL, and date
    const { path } = context;
    const statusCode = context.set.status;
    const date = getDatestamp();

    // Default log
    let bgLog = chalk.bgGreen;
    let txLog = chalk.green;

    // Response 5xx (Server Error)
    if (statusCode >= 500) {
      bgLog = chalk.bgRed;
      txLog = chalk.red;
    }

    // Response 4xx (Client Error)
    else if (statusCode >= 400) {
      bgLog = chalk.bgYellow;
      txLog = chalk.yellow;
    }

    // Response 3xx (Redirection)
    else if (statusCode >= 300) {
      bgLog = chalk.bgBlue;
      txLog = chalk.blue;
    }

    // Response 2xx (Success)
    else if (statusCode >= 200) {
      bgLog = chalk.bgGreen;
      txLog = chalk.green;
    }

    // Response 1xx (Informational)
    else if (statusCode >= 100) {
      bgLog = chalk.bgWhite;
      txLog = chalk.white;
    }

    let success = context.response?.success || false;
    let message = context.response?.message;

    // Get student ID
    const data = context.user ? context.user.student_id + " " : "";

    if ((path.startsWith("/photos") || path.startsWith("/favicon.ico")) && statusCode == 200) {
      success = true;
      message = "[ Photo ]";
    }
    
    if (context.request.method === "OPTIONS") return;

    // Log the response
    console.log(
      bgLog("[RESPONSE]") + " " + txLog(
        `[${data}${context.ip?.address}]${context.user?.role === AuthType.ICT_ADMIN ? ` [${context.user.campus.toUpperCase()}]` : ''} [${date}] [${context.request.method} ${path}] [${statusCode}] [ success: ${success}, message: ${message} ]`
      )
    );
  }

  /**
   * Log user/admin login
   * @param data Login data
   */
  static async login(data: LoginLogModel): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      // Log the login
      const result = await db.query<MariaUpdateResult>(
        `INSERT INTO login_logs (students_id, type, date_stamp) VALUES (?, ?, NOW())`, [data.students_id, data.type]
      ); 

      // If insertion is successful
      if (result.affectedRows > 0) {
        console.log(chalk.blue.bold("[*] New login detected [" + (data.type === AuthType.STUDENT ? 'STUDENT' : 'ADMIN') + "]: " + data.name + " #" + data.students_id + " (" + data.student_id + ")"));
        return resolve();
      }

      return reject("Failed to log login event.");
    });
  }
}

export default Log;