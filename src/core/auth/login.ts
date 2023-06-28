import type { Response, Request } from "express"
import { result } from "../../utils/response";
import Student from "../../db/models/student"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export function postLogin(request: Request, response: Response) {
  Student.fromId(request.body.id, (error, student) => {
    if (error !== null || student === null) {
      response.send(result.error("Login Failed"))
    } else {
      const pw = student.getPassword() || "";      
      validatePassword(request.body.password, pw, (isSuccess) => {
        if (isSuccess === true) {
          const token = jwt.sign({ data: student }, process.env.SECRET_KEY || "", { expiresIn: '1d' });
          response.send(result.success("Login Successful", { token: token }))
        } else {
          response.send(result.error("Login Failed"))
        }
      })
    }
  })

}

export function validatePassword(passwordInput: string, password: string, callback: (isSuccess: Boolean) => void) {
  const flag = bcrypt.compare(passwordInput, password, (error, result) => {
    if (error) {
      console.error(error);
      callback(false)
    }

    if (result) {
      console.log('Password matches!');
      callback(true)
    } else {
      console.log('Password does not match!');
      callback(false)
    }
  });
}
