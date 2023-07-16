import type { Response, Request } from "express"
import { result } from "../../utils/response";
import Student from "../../db/models/student"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Log } from "../../utils/log";
import { LOGIN_SUCCESS, LOGIN_FAILED } from "../../strings/strings.json";

/**
 * Login API
 * @author TotalElderBerry (Brian Keith Lisondra)
 */
export function login(request: Request, response: Response) {
  switch (request.method) {
    case 'POST':      
      postLogin(request, response)
      break;
  }
}

function postLogin(request: Request, response: Response) {
  Student.fromId(request.body.id, (error, student) => {
    if (error !== null || student === null) {
      response.send(result.error(LOGIN_FAILED))
    } else {
      const pw = student.getPassword() || "";      
      validatePassword(request.body.password, pw, (isSuccess) => {
        if (isSuccess === true) {
          const token = jwt.sign({ data: student }, process.env.SECRET_KEY || "", { expiresIn: '1d' });
          response.send(result.success(LOGIN_SUCCESS, { token: token }))
        } else {
          response.send(result.error(LOGIN_FAILED))
        }
      })
    }
  })

}

function validatePassword(passwordInput: string, password: string, callback: (isSuccess: Boolean) => void) {
  const flag = bcrypt.compare(passwordInput, password, (error, result) => {
    if (error) {
      console.error(error);
      callback(false)
    }

    if (result) {
      Log.e('Password matches!');
      callback(true)
    } else {
      Log.e('Password does not match!');
      callback(false)
    }
  });
}
