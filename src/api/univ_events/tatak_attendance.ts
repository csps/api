import type { ElysiaContext, ResponseBody } from "../../types";
import { ErrorTypes } from "../../types/enums";

import UnivStudent from "../../db/models/univ_events/student";
import response from "../../utils/response";
import Strings from "../../config/strings";
import { status501 } from "../../routes";
import Attendance from "../../db/models/univ_events/attendance";
import Tatakform from "../../db/models/tatakform";



/**
 * Attendance API
 * @author TotalElderBerry (Unknown af)
 * @param context
 */
export function tatak_attendance(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
    switch (context.request.method) {
      case "GET":
        return getAttendanceHistory(context);
      case "POST":
        return postAttendance(context);
      case "OPTIONS":
        return response.success();
    }
  
    return status501(context);
}

async function postAttendance(context: ElysiaContext){
    try {
      const slug = context.params?.slug;
      if(slug){
        const tatak_event = await Tatakform.getBySlug(slug);
        if(tatak_event){
          await Attendance.attendStudent(context.body.student_id, tatak_event);
        }
        return response.success("Attended successfully");
      }
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

        return response.error(error)
    }
}

async function getAttendanceHistory(context: ElysiaContext){
  try {
    const slug = context.params?.slug;
    if(slug){
      const tatak_event = await Tatakform.getBySlug(slug);
      const history = await Attendance.getAttendanceHistoryOfStudentEvent(context.user?.student_id, tatak_event.id);
      return response.success("Fetch Successful",history);
    }else{
      const history = await Attendance.getAllAttendanceHistoryOfStudent(context.user?.student_id);
      return response.success("Fetch Successful",history);
    }
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

      return response.error(error)
  }
}