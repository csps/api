import type { Response, Request } from "express"
import { result } from "../../utils/response";
import { ErrorTypes } from "../../types/enums";
import { SignJWT, jwtVerify } from 'jose';
import Student from "../../db/models/student"
import Strings from "../../config/strings";
import bcrypt from 'bcrypt';

/**
 * Login API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function login(request: Request, response: Response) {
  switch (request.method) {
    case 'POST':
      postLogin(request, response)
      break;
    case 'GET':
      getLogin(request, response)
      break;
  }
}

// Secret key
let secret: Uint8Array;

/**
 * GET /login/:token 
 */
async function getLogin(request: Request, response: Response) {
  // Get token
  const { token } = request.params;

  // If token is empty
  if (!token) {
    // Return error
    return response.status(400).send(result.error(Strings.LOGIN_EMPTY_TOKEN));
  }

  // If secret is empty
  if (!secret) {
    // Set secret
    secret = new TextEncoder().encode(process.env.SECRET_KEY);
  }

  // Verify token
  try {
    const { payload } = await jwtVerify(token, secret);
  
    // Get student from ID
    Student.fromId(payload.id as string, (error, student) => {
      if (error === ErrorTypes.DB_ERROR) {
        response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
        return;
      }

      // If not found
      if (error === ErrorTypes.DB_EMPTY_RESULT) {
        response.status(401).send(result.error(Strings.STUDENTS_NOT_FOUND));
        return;
      }

      response.send(result.success(Strings.LOGIN_SUCCESS, {
        id: student!.getStudentId(),
        name: student!.getFullname()
      }));
    });
  } catch (error) {
    response.send(result.error());
  }
}

/**
 * POST /login
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
function postLogin(request: Request, response: Response) {
  // Get id and password
  const { id, password } = request.body;

  // Check if id is present
  if (!id) {
    // If not, return error
    return response.status(400).send(result.error(Strings.LOGIN_EMPTY_ID))
  }

  // Check if password is present
  if (!password) {
    // If not, return error
    return response.status(400).send(result.error(Strings.LOGIN_EMPTY_PASSWORD))
  }

  // Get student from ID
  Student.fromId(id, (error, student) => {
    // If has error
    if (error !== null || student === null) {
      // Map error
      switch (error) {
        // If database error
        case ErrorTypes.DB_ERROR:
          response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
          return;
        // If no result
        case ErrorTypes.DB_EMPTY_RESULT:
          response.status(401).send(result.error(Strings.LOGIN_FAILED));
          return;
      }
    }

    // Validate password
    validatePassword(password, student!.getPassword(), async (success) => {
      // If success
      if (success) {
        // Encode secret key
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        // Generate token
        const token = await new SignJWT({ id: student!.getStudentId() })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuer('CSPS')
          .setExpirationTime('1d')
          .sign(secret);
        
        // Send response
        response.send(result.success(Strings.LOGIN_SUCCESS, { token: token }))
        return;
      }

      // Otherwise, return validation error
      response.status(401).send(result.error(Strings.LOGIN_FAILED));
    })
  });
}

/**
 * Validate password
 */
function validatePassword(input: string, password: string, callback: (success: boolean) => void) {
  // Compare password
  bcrypt.compare(input, password, (error, result) => {
    // If has error
    if (error) {
      console.error(error);
      callback(false)
    }

    // Return result
    callback(result);
  });
}
