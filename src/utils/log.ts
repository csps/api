import chalk from "chalk";

import { getDatestamp } from "./date";
import { Request, Response } from "express";
import { Parser } from "./parser";

/**
 * Custom logging event for CSPS Web App API
 * @author mavyfaby (Maverick Fabroa)
 */
export class Log {
  /**
   * Show error log
   * @param message Error message to log
   */
  static e(message: string) {
    console.log(chalk.bgRed("[-]") + " " + chalk.red(message));
  }

  /**
   * Show success log
   * @param message Success message to log
   */
  static s(message: string) {
    console.log(chalk.bgGreen("[+]") + " " + chalk.green(message));
  }

  /**
   * Show warning log
   * @param message Warning message to log
   */
  static w(message: string) {
    console.log(chalk.bgYellow("[!]") + " " + chalk.yellow(message));
  }

  /**
   * Show info log
   * @param message Info message to log
   */
  static i(message: string) {
    console.log(chalk.bgBlue("[*]") + " " + chalk.blue(message));
  }

  /**
   * Get middleware for logging
   * @returns 
   */
  static getMiddleware() {
    /**
     * Middleware for logging
     */
    return function(request: Request, response: Response, next: Function) {
      // Log the repsonse
      response.on("finish", () => {
        Log.response(request, response);
      });

      // Get the old send function
      const send = response.send;
      // Override the send function
      response.send = function(body: any) {
        // Check if the body is a string
        if ((body || "").length > 0) {
          // Parse the body to JSON
          const b: any = Parser.toJSON(body) || "";
          // Convert and set the body to string
          response.locals.body = b === "" ? "" : JSON.stringify({ success: b.success, message: b.message }, null, 0);
        }

        // Call the old send function
        return send.call(response, body);
      };

      // Call the next middleware
      next();
    }
  }

  /**
   * Show response log information
   * @param request 
   * @param response 
   */
  static response(request: Request, response: Response) {
    // Get the IP, method, URL, and date
    const ip = request.ip;
    const method = request.method;
    const url = request.originalUrl;
    const date = getDatestamp();

    // Default log
    let bgLog = chalk.bgGreen;
    let txLog = chalk.green;

    // Response 5xx (Server Error)
    if (response.statusCode >= 500) {
      bgLog = chalk.bgRed;
      txLog = chalk.red;
    }

    // Response 4xx (Client Error)
    else if (response.statusCode >= 400) {
      bgLog = chalk.bgYellow;
      txLog = chalk.yellow;
    }

    // Response 3xx (Redirection)
    else if (response.statusCode >= 300) {
      bgLog = chalk.bgBlue;
      txLog = chalk.blue;
    }

    // Response 2xx (Success)
    else if (response.statusCode >= 200) {
      bgLog = chalk.bgGreen;
      txLog = chalk.green;
    }

    // Response 1xx (Informational)
    else if (response.statusCode >= 100) {
      bgLog = chalk.bgWhite;
      txLog = chalk.white;
    }
    // Get the response status
    const { statusCode, locals } = response;
    // Get the response data
    const responseData = locals.body || "";
    // Get the request data
    const requestData = request.originalUrl.startsWith("/photos") ? "*photos*" : (
      request.body.length > 0 && request.body.startsWith("{") && request.body.endsWith("}") ?
        Parser.toJSON(request.body) === null ? "" :
        JSON.stringify(Parser.toJSON(request.body) || "", null, 0) :
        ""
    );

    // Log the response
    console.log(
      bgLog("[RESPONSE]") + " " + txLog(
        `[${ip}] [${date}] [${method} ${url}] [${statusCode}] [${requestData}] [${responseData}]`
      )
    );
  }
}

