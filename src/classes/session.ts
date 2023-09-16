import type { Request } from "express";
import { jwtVerify } from "jose";;
import { ErrorTypes, AuthType } from "../types/enums";
import { Log } from "../utils/log";

/**
 * Session class
 * @author mavyfaby (Maverick Fabroa)
 */
export class Session {
  /**
   * Get student ID from jwt session
   */
  static async getSession(request: Request | string, callback: (error: ErrorTypes | null, data: SessionData | null) => void) {
    // Default token
    let token = typeof request === 'string' ? request : '';

    // If request is a Request object
    if (typeof request !== 'string') {
      // Get authorization header
      const authorization = request.headers.authorization;
  
      // If authorization header is not present
      if (!authorization) {
        callback(null, { id: "" });
        return; 
      }
  
      // Get token
      token = authorization.split(' ')[1];
    }

    // If using API key
    if (token === process.env.API_KEY) {
      Log.i("Using API KEY");
      callback(null, { id: "API_KEY", role: AuthType.ADMIN });
      return;
    }

    // Decode secret key
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    try {
      // Verify and Get data
      const id = (await jwtVerify(token, secret, { algorithms: ['HS256'] })).payload.id as string;
      // Get role
      const role = id.startsWith("S") ? AuthType.STUDENT : id.startsWith("A") ? AuthType.ADMIN : undefined;
      // Verify token
      callback(null, { id: id.split("-")[1], role });
    } catch (e) {
      // Log error
      console.error(e);
      // If session expired
      callback(ErrorTypes.DB_EXPIRED, null);
    }
  }
}