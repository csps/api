import type { Request } from "express";
import { jwtVerify } from "jose";;
import { ErrorTypes } from "../types/enums";

/**
 * Session class
 * @author mavyfaby (Maverick Fabroa)
 */
export class Session {
  /**
   * Get student ID from jwt session
   */
  static async getStudentID(request: Request | string, callback: (error: ErrorTypes | null, studentID: string | null) => void) {
    // Default token
    let token = typeof request === 'string' ? request : '';

    // If request is a Request object
    if (typeof request !== 'string') {
      // Get authorization header
      const authorization = request.headers.authorization;
  
      // If authorization header is not present
      if (!authorization) {
        callback(ErrorTypes.UNAUTHORIZED, null);
        return;
      }
  
      // Get token
      token = authorization.split(' ')[1];
    }

    // Decode secret key
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    try {
      // Verify token
      callback(null, (await jwtVerify(token, secret, { algorithms: ['HS256'] })).payload.id as string);
    } catch (e) {
      // If session expired
      callback(ErrorTypes.DB_EXPIRED, null);
    }
  }
}