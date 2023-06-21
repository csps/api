/**
 * @author TotalElderBerry (Brian Keith Lisondra)
 */

import type {Response, Request} from "express"
import { result } from "../../utils/response";
import jwt from 'jsonwebtoken';


export function login(request: Request, response: Response){
    switch(request.method){
        case 'GET':
            break;
        case 'POST':
            break;
    }
}

export function postLogin(request: Request, response: Response){
    const isSuccess = validatePassword(request.body.password)
    if(isSuccess === true){
        let data = {
            id: 12,
        }
      
        const token = jwt.sign(data, "secretkeyhere", { expiresIn: '1d' });
        response.send(result.success("Login Successful", {token: token}))
    }else{
        response.send(result.error("Login Failed"))
    }
}

export function validatePassword(password: string){
    return true
}
