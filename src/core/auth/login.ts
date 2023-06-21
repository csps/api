/**
 * @author TotalElderBerry (Brian Keith Lisondra)
 */
import type {Response, Request} from "express"
import { result } from "../../utils/response";
import jwt from 'jsonwebtoken';
import Student from "../../db/models/student"
import bcrypt from 'bcrypt';


export function login(request: Request, response: Response){
    switch(request.method){
        case 'GET':
            break;
        case 'POST':
            postLogin(request,response)
            break;
    }
}

export function postLogin(request: Request, response: Response){
    Student.fromId(request.body.id, (error,student, password)=>{
        if(error === null){
            response.send(result.error("Login Failed"))
        }else{
            const pw = password || "";
            const isSuccess = validatePassword(request.body.password, pw)
            if(isSuccess === true){
                const token = jwt.sign({data: student}, process.env.SECRET_KEY || "", { expiresIn: '1d' });
                response.send(result.success("Login Successful", {token: token}))
            }else{
                response.send(result.error("Login Failed"))
            }
        }
    })

}

export function validatePassword(passwordInput: string, password: string){
    bcrypt.compare(passwordInput, password, (error, result) => {
        if (error) {
          console.error(error);
          return false;
        }
      
        if (result) {
            console.log('Password matches!');
            return true
        } else {
            console.log('Password does not match!');
        }
    });
    return false
}
