import chalk from "chalk";
import Elysia from "elysia";
import { ip } from "elysia-ip";

import { ElysiaContext, ResponseBody } from "../types";
import { getDatestamp } from "./date";

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
    if (highlight) {
      console.log(chalk.bgRed("[-] " + message));
      return;
    }

    console.log(chalk.bgRed("[-]") + " " + chalk.red(message));
  }

  /**
   * Show success log
   * @param message Success message to log
   * @param highlight Highlight the log
   */
  static s(message: any, highlight?: boolean) {
    if (highlight) {
      console.log(chalk.bgGreen("[+] " + message));
      return;
    }

    console.log(chalk.bgGreen("[+]") + " " + chalk.green(message));
  }

  /**
   * Show warning log
   * @param message Warning message to log
   * @param highlight Highlight the log
   */
  static w(message: any, highlight?: boolean) {
    if (highlight) {
      console.log(chalk.bgYellow("[!] " + message));
      return;
    }

    console.log(chalk.bgYellow("[!]") + " " + chalk.yellow(message));
  }

  /**
   * Show info log
   * @param message Info message to log
   * @param highlight Highlight the log
   */
  static i(message: any, highlight?: boolean) {
    if (highlight) {
      console.log(chalk.bgBlue("[*] " + message));
      return;
    }

    console.log(chalk.bgBlue("[*]") + " " + chalk.blue(message));
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

    const success = context.response?.success || false;
    const message = context.response?.message || context.response;

    // Get student ID
    const data = context.user ? context.user.student_id + " " : "";

    // Log the response
    console.log(
      bgLog("[RESPONSE]") + " " + txLog(
        `[${data}${context.ip?.address}] [${date}] [${context.request.method} ${context.path}] [${statusCode}] [ success: ${success}, message: ${message} ]`
      )
    );
  }
}

export default Log;