import { jwtVerify } from "jose";;
import type { Request } from "express";

/**
 * Session class
 * @author mavyfaby (Maverick Fabroa)
 */
export class Session {
  /**
   * Get student ID from jwt session
   */
  static getStudentID(request: Request, callback: (studentID: string | null) => void) {
    // Get authorization header
    const authorization = request.headers.authorization;

    // If authorization header is not present
    if (!authorization) {
      callback(null);
      return;
    }

    // Get token
    const token = authorization.split(' ')[1];
    // Decode secret key
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    // Verify token
    jwtVerify(token, secret, { algorithms: ['HS256']  })
      .then((result) => callback(result.payload.id as string))
      .catch(() => callback(null));
  }
}