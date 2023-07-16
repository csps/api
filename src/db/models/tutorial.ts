import { DatabaseModel, ErrorTypes } from "../../types";
import { TutorialType } from "../../types/models";
import Database from "../database";
import { Log } from "../../utils/log";
import { DatabaseHelper } from "../helper";
import { Tables, TutorialColumns } from "../structure";
import { getDatestamp } from "../../utils/date";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */

class Tutorial extends DatabaseModel{
    private id: number;
    private studentId: String;
    private language: String;
    private schedule: String;
    private status: String;
    private status_date_stamp: String;
    private remarks: String;
    private date_stamp: String;

    public constructor(data: TutorialType){
        super();
        this.id = data.id;
        this.studentId = data.student_id.trim();
        this.language = data.language.trim();
        this.schedule = data.schedule.trim();
        this.status = data.status.trim();
        this.status_date_stamp = data.status_date_stamp.trim();
        this.remarks = (data.remarks == null)?"":data.remarks.trim();
        this.date_stamp = data.date_stamp.trim();
    }

    public get getDateStamp(){
        return this.date_stamp;
    }

    public static fromId(id: number, callback:  (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {
        
    }

    public static getAll(callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void){
        const db = Database.getInstance();

        db.query("SELECT * from tutorials",[], (error, results)=>{
            // If has an error
        if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR, null);
            return;
        }
        
        // If no results
        if (results.length === 0) {
            callback(ErrorTypes.DB_EMPTY_RESULT, null);
            return;
        }

        // Create Students
        const tutorials: Tutorial[] = [];

        // Loop through the results
        for (const data of results) {
            // Create Student object
            const tutorial = new Tutorial({
            // Student ID / Student Number
            id: data.id,
            // Student Primary Key ID
            student_id: data.student_id,
            // Student Email Address
            language: data.language,
            // Student First Name
            schedule: data.schedule,
            // Student Last Name
            status: data.status,
            // Student Year Level
            status_date_stamp: data.status_date_stamp,
            // Student Birth Date
            remarks: data.remarks,
            // Student password
            date_stamp: data.date_stamp
            });
            
            // Push the student object to the array
            tutorials.push(tutorial);
        }

        // Return the students
        callback(null, tutorials);
        })
    }

    public static insert(tutorial: TutorialType, callback: (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {
        /**
         * Check if the tutorial already exists
         */
    
        const db = Database.getInstance();
        // Get the current date
        const datestamp = getDatestamp();

        // Query the database
        db.query("INSERT INTO tutorials (student_id, language, schedule, status, status_date_stamp, remarks, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?)", [
          tutorial.student_id,
          tutorial.language.trim(),
          tutorial.schedule.trim(),
          tutorial.status.trim(),
          tutorial.status_date_stamp.trim(),
          tutorial.remarks.trim(),
          tutorial.date_stamp.trim(),
        ], (error, results) => {
          // If has an error
          if (error) {
            Log.e(error.message);
            callback(ErrorTypes.DB_ERROR, null);
            return;
          }
    
          
          // Return the student
          callback(null, new Tutorial(tutorial));
        });
        
    };

    public static getByYear(year: string, callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void) {
        /**
         * Check if the tutorial already exists
         */
    
        const db = Database.getInstance();
        // Get the current date
        const datestamp = getDatestamp();
        const yearDate = parseInt(year)
        
        if(!isNaN(yearDate)){
            const query = `select * from tutorials where YEAR(date_stamp)=${yearDate} or YEAR(date_stamp)=${yearDate + 1};`
            
            db.query(query,[],(error,results) => {
                if (error) {
                    Log.e(error.message);
                    callback(ErrorTypes.DB_ERROR, null);
                    return;
                }
                
                // If no results
                if (results.length === 0) {
                    callback(ErrorTypes.DB_EMPTY_RESULT, null);
                    return;
                }
        
                // Create Students
                const tutorials: Tutorial[] = [];
        
                // Loop through the results
                for (const data of results) {
                    // Create Student object
                    const tutorial = new Tutorial({
                    // Student ID / Student Number
                    id: data.id,
                    // Student Primary Key ID
                    student_id: data.student_id,
                    // Student Email Address
                    language: data.language,
                    // Student First Name
                    schedule: data.schedule,
                    // Student Last Name
                    status: data.status,
                    // Student Year Level
                    status_date_stamp: data.status_date_stamp,
                    // Student Birth Date
                    remarks: data.remarks,
                    // Student password
                    date_stamp: data.date_stamp
                    });
                    
                    // Push the student object to the array
                    tutorials.push(tutorial);
                }
        
                // Return the tutorials
                callback(null, tutorials);
                return
            })
        }else{
            callback(ErrorTypes.DB_EMPTY_RESULT, null);
            return;
        }
    }
      
}

export default Tutorial;