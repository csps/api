import type { ElysiaContext, ResponseBody } from "../../types";
import { ErrorTypes } from "../../types/enums";

import UnivStudent from "../../db/models/univ_events/student";
import response from "../../utils/response";
import Strings from "../../config/strings";
import { status501 } from "../../routes";



/**
 * Students API
 * @author TotalElderBerry (Unknown af)
 * @param context
 */
export function students(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
    switch (context.request.method) {
      case "GET":
        // return getStudents(context);
      case "POST":
        return postStudents(context);
      case "PUT":
        // return putStudents(context);
      case "OPTIONS":
        return response.success();
    }
  
    return status501(context);
}

async function postStudents(context: ElysiaContext){
    try {
        await UnivStudent.insert(context.body);
        // If no error, student is created
        return response.success(Strings.STUDENT_CREATED);
    } catch (error) {
        // if list of errors
        if (Array.isArray(error)) {
            context.set.status = 400;
            return response.error(error[0], error[1]);
        }
    
        // If database error
        if (error === ErrorTypes.DB_ERROR) {
            context.set.status = 500;
            return response.error(Strings.STUDENT_POST_ERROR);
        }
    }
}