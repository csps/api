import { Log } from "../../utils/log";
import { ErrorTypes, ModeOfPayment, OrderStatus } from "../../types/enums";
import Database, { DatabaseModel } from "../database";
import type { OrderType } from "../../types/models";

/**
 * Order model
 * This model represents the orders table in the database
 * @author mavyfaby (Maverick Fabroa)
 */
export class Order extends DatabaseModel {
  private id: number;
  private student_id: string;
  private product_variations_id: number;
  private quantity: number;
  private mode_of_payment_id: ModeOfPayment;
  private status_id: OrderStatus;
  private user_remarks: string;
  private admin_remarks: string;
  private status_updated: string;
  private edit_date: string;
  private date_stamp: string;

  /**
   * Order Private Constructor
   * @param data Order data
   */
  public constructor(data: OrderType) {
    super();
    this.id = data.id;
    this.student_id = data.student_id;
    this.product_variations_id = data.product_variations_id;
    this.quantity = data.quantity;
    this.mode_of_payment_id = data.mode_of_payment_id;
    this.status_id = data.status_id;
    this.user_remarks = data.user_remarks;
    this.admin_remarks = data.admin_remarks;
    this.status_updated = data.status_updated;
    this.edit_date = data.edit_date;
    this.date_stamp = data.date_stamp;
  }

  /**
   * Get order by ID
   * @param id Order ID
   * @param callback Callback function
   */
  public static fromId(id: string, callback: (error: ErrorTypes | null, order: Order | null) => void) {
    // TODO: Implement this
  }

  /**
   * Get all orders
   * @param callback 
   */
  public static getAll(callback: (error: ErrorTypes | null, order: Order[] | null) => void) {
    // TODO: Implement this
  }

  /**
   * Get all orders by student ID
   * @param studentID Student ID
   * @param callback 
   */
  public static getAllByStudentID(studentID: string, callback: (error: ErrorTypes | null, order: Order[] | null) => void) {
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query('SELECT * FROM orders WHERE students_id = ?', [studentID], (error, results) => {
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

      // Create and return the students
      callback(null, results.map((order: OrderType) => new Order(order)));
    });
  }

  /**
   * Get Order ID
   */
  public getId() {
    return this.id;
  }
}