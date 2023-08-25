import { ErrorTypes, ModeOfPayment, OrderStatus } from "../../types/enums";
import type { OrderModel } from "../../types/models";
import type { FileArray } from "express-fileupload";
import { getDatestamp, getLocalDate } from "../../utils/date";
import { generateReceiptID, sanitize } from "../../utils/security";
import { OrderColumns } from "../structure";
import { Log } from "../../utils/log";

import Database, { DatabaseModel } from "../database";
import Strings from "../../config/strings";
import { OrderRequest } from "../../types/request";
import { getFile } from "../../utils/file";
import { Photo } from "./photo";

/**
 * Order model
 * This model represents the orders table in the database
 * @author mavyfaby (Maverick Fabroa)
 */
export class Order extends DatabaseModel {
  private id: number;
  private students_id: string;
  private products_id: number;
  private variations_id: number | null;
  private quantity: number;
  private mode_of_payment: ModeOfPayment;
  private status: OrderStatus;
  private user_remarks: string;
  private admin_remarks: string;
  private status_updated: string;
  private edit_date: string;
  private date_stamp: string;

  /**
   * Order Private Constructor
   * @param data Order data
   */
  public constructor(data: OrderModel) {
    super();
    this.id = data.id;
    this.students_id = data.students_id;
    this.products_id = data.products_id;
    this.variations_id = data.variations_id;
    this.quantity = data.quantity;
    this.mode_of_payment = data.mode_of_payment;
    this.status = data.status;
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
  public static getAllByStudentID(studentID: string | undefined, callback: (error: ErrorTypes | null, order: Order[] | null) => void) {
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
      callback(null, results.map((order: OrderModel) => new Order(order)));
    });
  }

  /**
   * Validate Order Data
   * @param data Raw order Data
   */
  public static validate(data: OrderRequest, isLoggedIn: boolean, files?: FileArray | null) {
    // If product ID is empty
    if (!data.products_id) return [Strings.ORDER_EMPTY_PRODUCT_ID, "products_id"];
    // If mode_of_payment is empty
    if (!data.mode_of_payment) return [Strings.ORDER_EMPTY_MODE_OF_PAYMENT, "mode_of_payment"];
    // If quantity is empty
    if (!data.quantity) return [Strings.ORDER_EMPTY_QUANTITY, "quantity"];

    // If mode of payment is GCash
    if (data.mode_of_payment == ModeOfPayment.GCASH) {
      // Check if photo/proof is present
      if (!getFile(files, "proof")) return [Strings.ORDER_EMPTY_PROOF, "proof"];
    }
    
    // If not logged in 
    if (!isLoggedIn) {
      // Check student id
      if (!data.students_id) return [Strings.ORDER_EMPTY_STUDENT_ID, "students_id"];
      // Check student first name
      if (!data.students_first_name) return [Strings.ORDER_EMPTY_STUDENT_FIRST_NAME, "students_first_name"];
      // Check student last name
      if (!data.students_last_name) return [Strings.ORDER_EMPTY_STUDENT_LAST_NAME, "students_last_name"];
      // Check student email
      if (!data.students_email) return [Strings.ORDER_EMPTY_STUDENT_EMAIL, "students_email"];
      // Check student course
      if (!data.students_course) return [Strings.ORDER_EMPTY_STUDENT_COURSE, "students_course"];
      // Check student year
      if (!data.students_year) return [Strings.ORDER_EMPTY_STUDENT_YEAR, "students_year"];
    }
  }

  /**
   * Insert order data to the database
   * @param studentID Student ID
   * @param order Order Data
   * @param callback Callback Function
   */
  public static insert(studentID: string | undefined, order: OrderRequest, files: FileArray | null, callback: (error: ErrorTypes | null, receiptID: string | null) => void) {
    // Get database instance
    const db = Database.getInstance();
    const datestamp = getDatestamp();
    const isLoggedIn = !!studentID;

    // If mode of payment is GCash
    if (order.mode_of_payment === ModeOfPayment.GCASH) {
      // Get screenshot/proof
      const proof = getFile(files, "proof");

      if (!proof) {
        Log.e(`Student #${studentID || order.students_id} is ordering with GCash without screenshot/proof.`);
        callback(ErrorTypes.REQUEST_FILE, null);
        return;
      }
    }

    Order.getOrdersCountFromDate(new Date(), (count) => {
      // Generate receipt ID
      const receiptID = generateReceiptID(count + 1);

      Database.getConnection((error, conn) => {
        if (error) {
          Log.e(error.message);
          callback(ErrorTypes.DB_ERROR, null);
          return;
        }

        // If logged in
        if (isLoggedIn) {
          // Query the Database
          db.query("INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            receiptID,
            studentID,
            order.products_id,
            order.variations_id || null,
            order.quantity,
            order.mode_of_payment,
            OrderStatus.PENDING_PAYMENT,
            "", "", null, null, datestamp
          ], (error, results) => {
            if (error) {
              Log.e(error.message);
              callback(ErrorTypes.DB_ERROR, null);
              return;
            }
            
            insertProof();
          });

          return;
        }

        // Otherwise, insert to non-bscs orders
        db.query("INSERT INTO non_bscs_orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          receiptID,
          order.products_id,
          order.variations_id || null,
          order.quantity,
          order.mode_of_payment,
          order.students_id,
          order.students_first_name,
          order.students_last_name,
          order.students_email,
          order.students_course,
          order.students_year,
          OrderStatus.PENDING_PAYMENT,
          "", "", null, null, datestamp
        ], (error, results) => {
          // If has an error
          if (error) {
            Log.e(error.message);

            // Rollback the transaction
            conn.rollback(() => {
              callback(ErrorTypes.DB_ERROR, null);
              return;
            });

            return;
          }

          insertProof();
        });

        function insertProof() {
          // If mode of payment is GCash
          if (order.mode_of_payment == ModeOfPayment.GCASH) {
            // Get screenshot/proof
            const photo = getFile(files, "proof");

            if (!photo) {
              // Rollback the transaction
              conn.rollback(error => {
                if (error) Log.e(error.message);
                callback(ErrorTypes.REQUEST_FILE, null);
                return;
              });

              return;
            }

            // Insert the photo
            Photo.insert({ data: photo.data, type: photo.mimetype, name: photo.name, is_receipt: true }, (error, photo) => {
              if (error === ErrorTypes.DB_ERROR) {
                Log.e(`Student #${studentID || order.students_id}: Error inserting screenshot/proof`);

                // Rollback the transaction
                conn.rollback(error => {
                  if (error) Log.e(error.message);
                  callback(ErrorTypes.DB_ERROR, null);
                  return;
                });

                return;
              }

              // Commit the transaction
              conn.commit((error) => {
                if (error) {
                  Log.e(error.message);

                  // Rollback the transaction
                  conn.rollback(error => {
                    if (error) Log.e(error.message);
                    callback(ErrorTypes.DB_ERROR, null);
                    return;
                  });

                  return;
                }

                // Log order 
                Log.i(`Student #${studentID || order.students_id} is ordering the product #${order.products_id} with receipt ID ${receiptID} by GCash`);
                // Success commiting the transaction
                callback(null, receiptID);
              });
            });

            return;
          }

          // Otherwise, commit the transaction and return the receipt ID
          conn.commit((error) => {
            if (error) {
              Log.e(error.message);

              conn.rollback(error => {
                if (error) Log.e(error.message);
                callback(ErrorTypes.DB_ERROR, null);
                return;
              });

              return;
            }

            // Log order 
            Log.i(`Student #${studentID || order.students_id} is ordering the product #${order.products_id} with receipt ID ${receiptID} by Walk-in`);
            // Success commiting the transaction
            callback(null, receiptID);
          });
        }
      });
    });
  }

  /**
   * Update order data
   * @param id Order ID
   * @param key Order Key
   * @param value Order Value
   */
  public static update(id: string | number, key: string, value: string, callback: (error: ErrorTypes | null, success: boolean) => void) { 
    // If order ID is not present
    if (!id) {
      callback(ErrorTypes.REQUEST_ID, false);
      return;
    }

    // If key is not present
    if (!key) {
      callback(ErrorTypes.REQUEST_KEY, false);
      return;
    }

    // if key doesn't exists in order allowed keys
    if (!process.env.ORDERS_UPDATE_ALLOWED_KEYS?.includes(key)) {
      callback(ErrorTypes.REQUEST_KEY_NOT_ALLOWED, false);
      return;
    }

    // Get database instance
    const db = Database.getInstance();
    // Default data to set
    let data = `${sanitize(key)} = ?`

    // If key is status_id
    if (key === OrderColumns.STATUS) {
      data = `${OrderColumns.STATUS} = ?, ${OrderColumns.STATUS_UPDATED} = NOW()`;
    }

    // Query the database
    db.query(`UPDATE orders SET ${data}, ${OrderColumns.EDIT_DATE} = NOW() WHERE id = ?`, [value, id], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(ErrorTypes.DB_ERROR, false);
        return;
      }

      // If no results
      if (results.affectedRows === 0) {
        callback(ErrorTypes.DB_EMPTY_RESULT, false);
        return;
      }

      // Otherwise, return success
      callback(null, true);
    });
  }

  /**
   * Get orders count from date
   * @param date Date to get orders count
   * @param callback Callback function
   */
  private static getOrdersCountFromDate(date: Date, callback: (count: number) => void) {
    // Get database instance
    const db = Database.getInstance();
    // Get local date YYYY-MM-DD
    const localDate = getLocalDate(date);

    // Query the database
    db.query("SELECT SUM(count) AS count FROM ((SELECT COUNT(*) AS count FROM orders WHERE DATE(date_stamp) = ?) UNION (SELECT COUNT(*) AS count FROM non_bscs_orders WHERE DATE(date_stamp) = ?)) t", [localDate, localDate], (error, results) => {
      // If has an error
      if (error) {
        Log.e(error.message);
        callback(0);
        return;
      }

      // If no results
      if (results.length === 0) {
        callback(0);
        return;
      }

      // Otherwise, return success
      callback(results[0].count);
    });
  }

  /**
   * Get Order ID
   */
  public getId() {
    return this.id;
  }
}