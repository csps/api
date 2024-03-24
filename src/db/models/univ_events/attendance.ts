import Database from "../..";
import { MariaUpdateResult } from "../../../types";
import { AttendanceModel, TatakformModel } from "../../../types/models";
import Log from "../../../utils/log";

/**
 * UC Days Attendance Model
 * @author TotalElderBerry (lala)
 */
class Attendance {
  public static attendStudent(studentId: any, tatak_event: TatakformModel){
    return new Promise(async (resolve, reject) => {
        // Get database instance
        const db = Database.getInstance();

        const currentDate = new Date();
        const fromDate = new Date(tatak_event.from_date);
        const toDate = new Date(tatak_event.to_date);
        let query;
        let columnName = "day1_am";
        if (currentDate >= fromDate && currentDate <= toDate) {
            const dayDifference = Math.floor((currentDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
            const currentDay = dayDifference + 1;
            const isAm = this.isAM();
            if(currentDay === 1 && !isAm){
                columnName = "day1_pm";
            }else if(currentDay === 2 && isAm){
                columnName = "day2_am";
            }else if(currentDay === 2 && !isAm){
                columnName = "day2_pm";
            }else if(currentDay === 3 && isAm){
                columnName = "day3_am";
            }else if(currentDay === 3 && !isAm){
                columnName = "day3_pm";
            }
        } else {
            reject("Event still close")
            return
        }

        try {
            if(await this.hasAttended(studentId,tatak_event.id)){
                await this.hasNotYetTimeRegistered(studentId,tatak_event.id,columnName)
                query = `UPDATE attendance SET ${columnName} = NOW() WHERE student_id = ? and event_id = ?`
                const updateResult = await db.query<MariaUpdateResult>(
                    query,[studentId, tatak_event.id]
                );
                if(updateResult.affectedRows > 0){
                    resolve("Updated Attendance")
                }
            }else{
                query = `INSERT INTO attendance (student_id, event_id, ${columnName}) VALUES (?,?,NOW())`
                const updateResult = await db.query<MariaUpdateResult>(
                    query,[studentId, tatak_event.id]
                );
                if(updateResult.affectedRows > 0){
                    resolve("Added your attendance")
                }
            }
        } catch (error) {
            Log.e(error)
            reject(error)   
        }

      });
  }

  public static hasAttended(studentId: any, eventId: any){
    return new Promise(async (resolve, reject) => {
        // Get database instance
        const db = Database.getInstance();
  
        try {
          // Get admin by username
          const result = await db.query<[{count: bigint}]>(
            "SELECT COUNT(*) as count FROM attendance WHERE student_id = ? and event_id = ?", [studentId, eventId]
          );
          resolve(result[0].count);
        }
  
        // Log error and reject promise
        catch (e) {
          Log.e(e);
          reject(e);
        }
      });
  }

  public static getAttendanceHistoryOfStudentEvent(studentId:any, eventId:any){
    return new Promise(async (resolve, reject) => {
        // Get database instance
        const db = Database.getInstance();
  
        try {
          // Get admin by username
          const result = await db.query<AttendanceModel[]>(
            "SELECT * FROM attendance WHERE student_id = ? and event_id = ?", [studentId, eventId]
          );
          resolve([result, result.length]);
        }
  
        // Log error and reject promise
        catch (e) {
          Log.e(e);
          reject(e);
        }
      });
  }

  public static getAllAttendanceHistoryOfStudent(studentId:any){
    return new Promise(async (resolve, reject) => {
        // Get database instance
        const db = Database.getInstance();
  
        try {
          // Get admin by username
          const result = await db.query<AttendanceModel[]>(
            "SELECT * FROM attendance WHERE student_id = ?", [studentId]
          );
          resolve([result, result.length]);
        }
  
        // Log error and reject promise
        catch (e) {
          Log.e(e);
          reject(e);
        }
      });
  }

  public static getAllOfEvent(eventId: any, courseId:any){
    
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        const result = await db.query<AttendanceModel[]>(
          `select attendance.*, s.first_name, s.last_name, s.course_id, c.acronym from attendance inner join univ_students s inner join colleges_courses c on c.id = s.course_id where attendance.student_id = s.student_id and event_id = ? and c.college_id = ?`, [eventId,courseId]
        );

        if(result){
          resolve(result);
        }else{
          reject("Error")
        }
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(e);
      }
    });
  }

  private static hasNotYetTimeRegistered(studentId: any, eventId:any, columnName: string){
    return new Promise(async (resolve, reject) => {
        // Get database instance
        const db = Database.getInstance();
  
        try {
          // Get admin by username
          const result = await db.query<any>(
            `SELECT ${columnName} FROM attendance WHERE student_id = ? and event_id = ?`, [studentId, eventId]
          );
          if(result[0] === undefined || result[0][columnName] === null){
            resolve(result[0]);
          }else{
            reject("You already have attended")
          }
        }
  
        // Log error and reject promise
        catch (e) {
          Log.e(e);
          reject(e);
        }
      });
  }

  private static isAM(){
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour < 12 ? true : false;
  }

}

export default Attendance;
