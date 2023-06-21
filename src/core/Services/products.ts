/**
 * @author ampats11 (Jeremy Andy F. Ampatin)
 */

import type {Response, Request} from "express"
import { result } from "../../utils/response";
import Product from "../../db/models/product";


export function product(request: Request, response: Response){
    switch(request.method){
        case 'GET':
            //work on progress
    }
}

