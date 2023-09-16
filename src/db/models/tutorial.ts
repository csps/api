import { ErrorTypes, TutorialStatus } from "../../types/enums";
import { TutorialModel } from "../../types/models";
import Database, { DatabaseModel } from "../database";
import { Log } from "../../utils/log";
import { getDatestamp } from "../../utils/date";
import Strings from "../../config/strings";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express request object
 * @param response Express response object
 */
class Tutorial extends DatabaseModel {
  private id: number;
  private student_id: string;
  private language: string;
  private schedule: string;
  private status: TutorialStatus;
  private status_date_stamp: string;
  private remarks: string;
  private date_stamp: string;

  /**
   * Tutorial Public Constructor
   * @param data Raw Tutorial Data
   */
  public constructor(data: TutorialModel) {
    super();
    this.id = data.id;
    this.student_id = data.student_id;
    this.language = data.language;
    this.schedule = data.schedule;
    this.status = data.status;
    this.status_date_stamp = data.status_date_stamp;
    this.remarks = data.remarks;
    this.date_stamp = data.date_stamp;
  }
  
  /**
   * Get tutorial by ID
   * @param id 
   * @param callback 
   */
  public static fromId(id: number, callback: (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query("SELECT * FROM tutorials WHERE id = ?", [id], (error, results) => {
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

      // Create and return tutorial
      callback(null, new Tutorial(results[0]));
    });
  }

  /**
   * Get tutorial by academic year
   * @param year 
   * @param callback 
   */
  public static fromAcademicYear(year: number, callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get start date
    const startDate = `${year}-08-01`;
    // Get end date
    const endDate = `${year + 1}-07-01`;

    // Query the database
    db.query("SELECT * FROM tutorials WHERE date_stamp >= ? AND date_stamp < ?", [startDate, endDate], (error, results) => {
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

      // Create and return tutorials
      callback(null, results.map((tutorial: TutorialModel) => new Tutorial(tutorial)));
    });
  }

  /**
   * Get all tutorials
   * @param callback Callback function
   */
  public static getAll(callback: (error: ErrorTypes | null, tutorial: Tutorial[] | null) => void) {
    const db = Database.getInstance();

    // Query for getting all tutorials
    db.query("SELECT * FROM tutorials", [], (error, results) => {
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

      // Create and return tutorials
      callback(null, results.map((tutorial: TutorialModel) => new Tutorial(tutorial)));
    })
  }

  /**
   * Add a new tutorial
   * @param tutorial Tutorial information
   * @param callback Callback function
   */
  public static insert(tutorial: TutorialModel, callback: (error: ErrorTypes | null, tutorial: Tutorial | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // Query the database
    db.query("INSERT INTO tutorials (student_id, language, schedule, status, status_date_stamp, remarks, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      tutorial.student_id,
      tutorial.language.trim(),
      tutorial.schedule.trim(),
      tutorial.status,
      tutorial.status_date_stamp.trim(),
      tutorial.remarks.trim(),
      datestamp
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
    return this.student_id;
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

  public static validate(data: TutorialModel) {
    // If name is empty
    if (!data.date_stamp) return [Strings.TUTORIAL_EMPTY_DATE_STAMP, "date_stamp"];
    // If Short Description is empty
    if (!data.language) return [Strings.TUTORIAL_EMPTY_LANGUAGE, "language"];
    // If Short Description exceeds 128 characters
    if (!data.remarks) return [Strings.TUTORIAL_EMPTY_REMARKS, "remarks"];
    // If Description is empty
    if (!data.schedule) return [Strings.TUTORIAL_EMPTY_SCHEDULE, 'schedule'];
    // If Price is empty
    if (!data.status) return [Strings.TUTORIAL_EMPTY_STATUS, 'status'];
    // If Price is not in correct format
    // If Price is less than 0
    // If Stock is empty
    if (!data.status_date_stamp) return [Strings.TUTORIAL_EMPTY_STATUS_DATE_STAMP, "status_date_stamp"];
    // If Stock is not in correct format
    // If Stock is less than 0
    // If max quantity is not in correct format
    // If max_quantity is less than 0
    // If Thumbnail is empty
    if (!data.student_id) return [Strings.TUTORIAL_EMPTY_STUDENT_ID, "student_id"];
  }
}

export default Tutorial;