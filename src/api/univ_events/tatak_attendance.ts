import type { ElysiaContext, ResponseBody } from "../../types";
import { ErrorTypes } from "../../types/enums";

import UnivStudent from "../../db/models/univ_events/student";
import response from "../../utils/response";
import Strings from "../../config/strings";
import { status501 } from "../../routes";
import Attendance from "../../db/models/univ_events/attendance";
import Tatakform from "../../db/models/tatakform";
import UnivStudent from "../../db/models/univ_events/student";



/**
 * Attendance API
 * @author TotalElderBerry (Unknown af)
 * @param context
 */


export function tatak_attendance(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
      case "GET":
        if(context.params?.eventId){
          return getAllStudentsAttended(context);
        }
        return getAttendanceHistory(context);
      case "POST":
        return postAttendance(context);
        case "OPTIONS":
        return response.success();
    }
  
    return status501(context);
  }

/**
 * POST /tatakforms/attendance/:slug
 * @param context
 * Mark student as present in specific day
 */
async function postAttendance(context: ElysiaContext){
    try {
      const slug = context.params?.slug;
      if(slug){
        const tatak_event = await Tatakform.getBySlug(slug);
        const student = await UnivStudent.getByStudentId(context.body.student_id);
        if(tatak_event){
          await Attendance.attendStudent(context.body.student_id, tatak_event);
        }
        return response.success("Attended successfully",{student_id: context.body.student_id});
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

/**
 * GET /tatakforms/attendance/
 * - Fetches the attedance history of a student in all events
 * 
 * GET /tatakforms/attendance/:slug
 * - Fetches the attedance history of a student in an event
 * @param context
 * 
 */
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
          return response.error("Fetching Attendance Error");
      }

      return response.error(error)
  }
}

/**
 * GET /tatakforms/attendance/event/:eventId
 * - Fetches all attendance of students in an event of the course
 * @param context
 * 
 */
async function getAllStudentsAttended(context: ElysiaContext){
  try {
    const eventId = context.params?.eventId;
    if(eventId){
      const attendance = await Attendance.getAllOfEvent(eventId,context.user.college_id);
      return response.success("Success",attendance)
    }
  } catch (error) {
    return response.error(error)
  }
}
