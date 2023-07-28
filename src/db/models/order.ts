import { Log } from "../../utils/log";
import { ErrorTypes, ModeOfPayment, OrderStatus, Strings } from "../../types/enums";
import Database, { DatabaseModel } from "../database";
import type { OrderType } from "../../types/models";

import { getDatestamp } from "../../utils/date";

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
    // Get database instance
    const db = Database.getInstance();

    // Query the database
    db.query('SELECT * FROM orders WHERE id = ?', [id], (error, results) => {
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

      // Create and return the order
      callback(null, new Order(results[0]));
    });
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
   * Validate Order Data
   * @param data Raw order Data
   */
  public static validate(data: OrderType) {
    // If product_variations_id is empty
    if (!data.product_variations_id) return [Strings.ORDER_EMPTY_PRODUCT_VARIATION_ID, "product_variations_id"];
    // If mode_of_payment_id is empty
    if (!data.mode_of_payment_id) return [Strings.ORDER_EMPTY_MODE_OF_PAYMENT, "mode_of_payment_id"];
    // If quantity is empty
    if (!data.quantity) return [Strings.ORDER_EMPTY_QUANTITY, "quantity"];
  }

  /**
   * Insert order data to the database
   * @param studentID Student ID
   * @param order Order Data
   * @param callback Callback Function
   */
  public static insert(studentID: string, order: OrderType, callback: (error: ErrorTypes | null, order: Order | null) => void) {
    // // Get database instance
    const db = Database.getInstance();
    // Get the current date
    const datestamp = getDatestamp();

    // CHeck if order already exist by student ID, product variations ID, and is pending payment
    db.query("SELECT COUNT(*) AS count FROM orders WHERE students_id = ? AND product_variations_id = ? AND status_id = 1", [studentID, order.product_variations_id], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, null);
        return;
      }

      // If order already exist
      if (results[0].count > 0) {
        callback(ErrorTypes.DB_ORDER_ALREADY_EXISTS, null);
        return;
      }

      // Query the Database
      db.query("INSERT INTO orders (students_id, product_variations_id, quantity, mode_of_payment_id, status_id, user_remarks, admin_remarks, status_updated, edit_date, date_stamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        studentID,
        order.product_variations_id,
        order.quantity,
        order.mode_of_payment_id,
        OrderStatus.PENDING_PAYMENT,
        order.user_remarks,
        "", // Default admin_remarks
        null, // Default status_updated
        null, // Default edit_date
        datestamp
      ], (error, results) => {
        // If has an error
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR, null);
          return;
        }
  
        // Set order ID
        order.id = results.insertId;
        // Set student ID
        order.student_id = studentID;
        // Set status ID
        order.status_id = OrderStatus.PENDING_PAYMENT;
        // Set admin_remarks
        order.admin_remarks = "";
        // Set status_updated
        order.status_updated = "";
        // Set edit_date
        order.edit_date = "";
        // Set date_stamp
        order.date_stamp = datestamp;
  
        // Create and return the order
        callback(null, new Order(order));
      });
    });
  }

  /**
   * Get Order ID
   */
  public getId() {
    return this.id;
  }
}