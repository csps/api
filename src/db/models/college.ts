import { ErrorTypes } from "../../types/enums";
import type { CollegeModel, CourseModel } from "../../types/models";

import Log from "../../utils/log";
import Database from "../";

/**
 * College model
 * This model represents the colleges table in the database
 * @author mavyfaby (Maverick G. Fabroa)
 */
class College {

  /**
   * Get all courses
   */
  public static getAll(): Promise<CollegeModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all courses
        const colleges = await db.query<CollegeModel[]>(`SELECT * FROM colleges`);

        // If no results
        if (colleges.length === 0) {
          Log.e("No colleges found");
          return reject("No colleges found");
        }

        // Get all courses
        const courses = await db.query<CourseModel[]>(`SELECT * FROM colleges_courses`);

        // For every colleges
        for (const college of colleges) {
          // Add courses to college
          college.courses = courses.filter((course) => course.college_id === college.id);
        } 

        // Return the courses
        resolve(colleges);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Get college by acronym
   * @param acronym 
   */
  public static getByAcronym(acronym: string): Promise<CollegeModel> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get college by acronym
        const college = await db.query<CollegeModel[]>(`SELECT * FROM colleges WHERE acronym = ? LIMIT 1`, [acronym]);

        // If no results
        if (college.length === 0) {
          Log.e(`College with acronym ${acronym} not found`);
          return reject(`College with acronym ${acronym} not found`);

        }
        
        // Get all courses
        const courses = await db.query<CourseModel[]>(`SELECT * FROM colleges_courses WHERE college_id = ?`, [college[0].id]);
        // Set the courses to the college
        college[0].courses = courses;

        // Return the college
        resolve(college[0]);
      }
      
      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }
}

export default College;