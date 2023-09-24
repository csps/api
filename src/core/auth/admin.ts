import type { Response, Request } from "express"
import { result } from "../../utils/response";
import { ErrorTypes } from "../../types/enums";
import { SignJWT, jwtVerify } from 'jose';
import Strings from "../../config/strings";
import bcrypt from 'bcrypt';
import { Admin } from "../../db/models/admin";
import { Log } from "../../utils/log";
import { generateToken } from "../../utils/security";

/**
 * Admin Login API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function admin_login(request: Request, response: Response) {
  switch (request.method) {
    case 'POST':
      postAdminLogin(request, response)
      break;
    case 'GET':
      getAdminLogin(request, response)
      break;
  }
}

// Secret key
let secret: Uint8Array;

/**
 * GET /admins/login/:token 
 */
async function getAdminLogin(request: Request, response: Response) {
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

    // Get admin from ID
    Admin.fromId((payload.id as string).split("-")[1], (error, admin) => {
      // If has error
      if (error === ErrorTypes.DB_ERROR) {
        response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
        return;
      }

      // If not found
      if (error === ErrorTypes.DB_EMPTY_RESULT) {
        response.status(401).send(result.error(Strings.STUDENT_NOT_FOUND));
        return;
      }

      // Send response
      response.send(result.success(Strings.LOGIN_SUCCESS, {
        ...admin,
        password: ""
      }));
    });
  } catch (error) {
    response.send(result.error());
  }
}

/**
 * POST /admins/login
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
function postAdminLogin(request: Request, response: Response) {
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

  Admin.fromId(id, (error, admin) => {
    // If has error
    if (error !== null || admin === null) {
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
    validatePassword(password, admin!.getPassword(), async (success) => {
      // If success
      if (success) {
        // Encode secret key
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        // Generate token
        const token = await new SignJWT({ id: "A-" + admin!.getStudentId(), jti: generateToken(6) })
          .setProtectedHeader({ alg: 'HS256', typ: "JWT" })
          .setExpirationTime('1d')
          .sign(secret);

        // Log login
        Log.login({
          ip_address: (request.headers["x-forwarded-for"] || request.ip) as string,
          students_id: `${admin?.getId() || -1}`,
          name: admin?.getFullname() || "",
          student_id: admin?.getStudentId() || "",
          type: 1 // 0 = Student, 1 = Admin
        });
        
        // Send response
        response.send(result.success(Strings.LOGIN_SUCCESS, {
          token: token,
          student: {
            ...admin,
            password: ""
          }
        }));

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
