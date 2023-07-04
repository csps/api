import type { Request, Response } from "express";
import { result } from "./response";

/**
 * Custom request body parser for CSPS Web App API
 * @author mavyfaby (Maverick G. Fabroa)
 */
export class Parser {
  /**
   * Get middleware for parsing request body
   */
  static getMiddleware() {
    return function(request: Request, response: Response, next: Function) {
      // If request method is GET
      if (request.method === "GET") {
        // Continue to the next middleware
        return next();
      }

      // Try parsing the body
      const body = Parser.toJSON(request.body);

      // If body is null, return error
      if (body === null) {
        response.status(400).send(result.error("Invalid request JSON data!"));
        return;
      }

      // Otherwise, set the body
      request.body = body;
      // Continue to the next middleware
      next();
    }
  }

  /**
   * Convert a string to JSON
   * @param request 
   */
  private static toJSON(text: string): object | null {
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }
}