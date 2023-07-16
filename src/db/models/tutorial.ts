import { ErrorTypes } from "../../types/enums";
import { TutorialType } from "../../types/models";
import Database, { DatabaseModel } from "../database";
import { Log } from "../../utils/log";
import { getDatestamp } from "../../utils/date";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */
class Tutorial extends DatabaseModel {
  private id: number;
  private studentId: String;
  private language: String;
  private schedule: String;
  private status: String;
  private status_date_stamp: String;
  private remarks: String;
  private date_stamp: String;

  /**
   * Tutorial Public Constructor
   * @param data Raw Tutorial Data
   */
  public constructor(data: TutorialType) {
    super();
    this.id = data.id;
    this.studentId = data.student_id.trim();
    this.language = data.language.trim();
    this.schedule = data.schedule.trim();
    this.status = data.status.trim();
    this.status_date_stamp = data.status_date_stamp.trim();
    this.remarks = data.remarks?.trim();
    this.date_stamp = data.date_stamp.trim();
  }
  
  /**
   * Get tutorial by ID
   * @param id 
   * @param callback 
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {

  }

  /**
   * Get tutorial by academic year
   * @param year 
   * @param callback 
   */
  public static fromAcademicYear(year: number, callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Query the database
    db.query("SELECT * FROM tutorials WHERE YEAR(date_stamp) = ? OR YEAR(date_stamp) = ?", [year, year + 1], (error, results) => {
      // If has error
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
    });
  }

  /**
   * Get all tutorials
   * @param callback Callback function
   */
  public static getAll(callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void) {
    const db = Database.getInstance();

    db.query("SELECT * from tutorials", [], (error, results) => {
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

  /**
   * Add a new tutorial
   * @param tutorial Tutorial information
   * @param callback Callback function
   */
  public static insert(tutorial: TutorialType, callback: (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {
    // Get database instance
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
      datestamp,
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
  }

  /**
   * Get the Primary ID
   */
  public getId() {
    return this.id;
  }

  /**
   * Get student id
   * @returns Student ID
   */
  public getStudentId() {
    return this.studentId;
  }

  /**
   * Get language
   * @returns Programming Language
   */
  public getLanguage() {
    return this.language;
  }

  /**
   * Get schedule
   * @returns Schedule
   */
  public getSchedule() {
    return this.schedule;
  }

  /**
   * Get status
   * @returns Status
   */
  public getStatus() {
    return this.status;
  }

  /**
   * Get status updated datetime
   * @returns Status updated datetime
   */
  public getStatusDatestamp() {
    return this.status_date_stamp;
  }

  /**
   * Get remarks
   * @returns Remarks
   */
  public getRemarks() {
    return this.remarks;
  }

  /**
   * Get tutorial published datetime
   * @returns Datestamp
   */
  public getDatestamp() {
    return this.date_stamp;
  }
}

export default Tutorial;