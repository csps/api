import { generateReference, generateToken } from "../../utils/security";
import { ElysiaContext, MariaUpdateResult } from "../../types";
import { ErrorTypes, ModeOfPayment, OrderStatus } from "../../types/enums";
import { FullOrderModel } from "../../types/models";
import { OrderRequest, PaginationOutput } from "../../types/request";
import { getLocalDate } from "../../utils/date";
import { isEmail, isObjectEmpty } from "../../utils/string";
import { paginationWrapper } from "../../utils/pagination";

import Database from "..";
import Product from "./product";
import Log from "../../utils/log";
import Strings from "../../config/strings";
import Student from "./student";
import Photo from "./photo";

/**
 * Order model
 * This model represents the orders table in the database
 * @author mavyfaby (Maverick Fabroa)
 */
class Order {

  // Default query
  private static DEF_QUERY = `
    SELECT
      p.photos_hash, o.unique_id, o.reference, o.products_id, p.name AS product_name, p.price AS product_price,
      o.variations_id, pv.photos_hash AS variations_photo_hash, v.name AS variations_name, o.quantity, o.mode_of_payment,
      
      IF(o.students_id = 0, se.student_id, s.student_id) AS student_id, 
      IF(o.students_id = 0, se.first_name, s.first_name) AS first_name,
      IF(o.students_id = 0, se.last_name, s.last_name) AS last_name,
      IF(o.students_id = 0, se.email_address, s.email_address) AS email_address,
      IF(o.students_id = 0, se.course, 0) AS course,
      IF(o.students_id = 0, se.year_level, s.year_level) AS year_level,
      
      o.status, o.user_remarks, IF(o.students_id = 0, 1, 0) AS is_guest,
      o.admin_remarks, o.status_updated, o.edit_date, o.date_stamp

    FROM orders o 
    INNER JOIN products p ON p.id = o.products_id
    LEFT JOIN students s ON s.id = o.students_id
    LEFT JOIN students_guest se ON se.id = o.students_guest_id
    LEFT JOIN product_variations pv ON pv.id = o.variations_id
    LEFT JOIN variations v ON v.id = pv.variations_id
  `;

  /**
   * Get all orders
   */
  public static getAll(pagination?: PaginationOutput): Promise<[FullOrderModel[], count: number] > {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get pagination
        if (pagination && !isObjectEmpty(pagination)) {
          const { query, countQuery, values, countValues } = paginationWrapper(db, {
            query: Order.DEF_QUERY,
            request: pagination
          });

          const mainResult = await db.query<FullOrderModel[]>(query, values);
          const countResult = await db.query<[{ count: bigint }]>(countQuery, countValues);

          // If no results
          if (mainResult.length === 0) {
            Log.e("No orders found (pagination)");
            return reject(ErrorTypes.DB_EMPTY_RESULT);
          }

          return resolve([mainResult, Number(countResult[0].count) ]);
        }
        
        // Get all orders
        const result = await db.query<FullOrderModel[]>(Order.DEF_QUERY);

        // If no results
        if (result.length === 0) {
          Log.e("No orders found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve([ result, Number(result.length) ]);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Insert order data to the database
   */
  public static insert(context: ElysiaContext): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Get order request
      const request: OrderRequest = context.body;
      // Validate request
      const validation = Order.validate(request, !!context.user);
      // Get student id
      const studentID = request.student_id || context.user.student_id;

      // If validation failed
      if (validation) {
        Log.e(`Student #${studentID} is ordering with invalid data (${validation[0]})`);
        return reject(validation);
      }

      // If no gcash reference photo
      if (request.mode_of_payment == ModeOfPayment.GCASH && !context.body.proof) {
        Log.e(`Student #${studentID} is ordering with GCash without screenshot/proof.`);
        return reject(ErrorTypes.REQUEST_FILE);
      }

      // Get product by id
      const product = await Product.get(Number(request.products_id));

      // Check if product is unavailable atm
      if (!product.is_available) {
        Log.e(`Student #${studentID} is ordering an unavailable product #${request.products_id}. Rejecting...`);
        return reject(ErrorTypes.UNAVAILABLE);
      }
      
      // Check if product is out of stock
      if (product.stock < request.quantity) {
        Log.e(`Student #${studentID} is ordering an out of stock product #${request.products_id}. Rejecting...`);
        return reject(ErrorTypes.DB_PRODUCT_NO_STOCK);
      }

      // Get student id
      const { student_id } = context.user || request;
      // Default student unique id
      let studentGuestId = 0;
      let studentLoggedId = 0;

      // If logged in
      if (context.user) {
        // Get student data
        const student = await Student.getByStudentId(student_id);
        // Set student data
        request.student_course = 0; // BS in Computer Science
        request.student_email = student.email_address;
        request.student_first_name = student.first_name;
        request.student_last_name = student.last_name;
        request.student_year = Number(student.year_level);
        // Set student unique id
        studentLoggedId = student.id;
      }

      try {
        // Get orders count from date
        const count = await Order.getCountFromDate(new Date());
        // Generate reference
        const reference = generateReference(count + 1);
        // Generate order id
        const orderID = await generateToken(20);
        // Get database connection
        const db = await Database.getConnection();
        // Begin transaction
        await db.beginTransaction();

        // If NOT logged in, save student data to database
        if (!context.user) {
          // Insert guest student
          const result = await db.query<MariaUpdateResult>(
            `INSERT INTO students_guest VALUES (NULL, ?, ?, ?, ?, ?, ?, NOW())`, [
              request.student_id, request.student_first_name, request.student_last_name,
              request.student_email, request.student_course, request.student_year
            ]
          );

          // If no rows affected, rollback transaction
          if (result.affectedRows === 0) {
            Log.e(`[1] Student #${studentID} is ordering with invalid data while. Rolling back transaction...`);
            await db.rollback();
            return reject(ErrorTypes.DB_ERROR);
          }

          // Set student guest id
          studentGuestId = result.insertId;
        }

        // Insert order
        const result = await db.query<MariaUpdateResult>(
          `INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, [
            reference, orderID, studentLoggedId, studentGuestId, request.products_id,
            request.variations_id, request.quantity, request.mode_of_payment,
            OrderStatus.PENDING_PAYMENT, "", "", null, null
          ]
        );

        // If no rows affected, rollback transaction
        if (result.affectedRows === 0) {
          Log.e(`[2] Student #${studentID} is ordering with invalid data. Rolling back transaction...`);
          await db.rollback();
          return reject(ErrorTypes.DB_ERROR);
        }

        // Insert proof (if exists)
        if (request.mode_of_payment == ModeOfPayment.GCASH && context.body.proof) {
          try {
            await Photo.insert({ photo: context.body.proof, reference, db });
          }

          catch (e) {
            // If error
            Log.e(`[${e == ErrorTypes.DB_EMPTY_RESULT ? 1 : 2}] Order Insert Error: Proof not inserted. Rolling back transaction...`);
            await db.rollback();
            return reject(e);
          }
        }
        
        // Commit transaction
        await db.commit();
        // Deduct stock based on requested quantity
        await Product.updateStock(Number(request.products_id), -request.quantity);
        // Log success
        Log.i(`Student #${studentID} ordered product #${request.products_id} with reference #${reference}`);
        // Resolve promise
        resolve();
      }

      catch (err) {
        Log.e(err);
        return reject(typeof err === 'number' ? err : ErrorTypes.DB_ERROR);
      }
    });
  }


  /**
  * Get orders count from date
  * @param date Date to get orders count
  */
  private static getCountFromDate(date: Date): Promise<number> {
    return new Promise(async (resolve, reject) => {
        // Get database instance
      const db = Database.getInstance();
      // Get local date YYYY-MM-DD
      const localDate = getLocalDate(date);

      try {
        // Query the database
        const result = await db.query<[{ count: bigint }]>(
          `SELECT SUM(count) AS count FROM (SELECT COUNT(*) AS count FROM orders WHERE DATE(date_stamp) = ?) t`, [ localDate ]
        );

        // Resolve promise
        resolve(Number(result[0].count));
      }

      catch (err) {
        Log.e(err);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

  /**
   * Validate Order Data
   * @param data Raw order Data
   */
  private static validate(data: OrderRequest, isLoggedIn: boolean) {
    // If product ID is empty
    if (!data.products_id) return [Strings.ORDER_EMPTY_PRODUCT_ID, "products_id"];
    // If mode_of_payment is empty
    if (!data.mode_of_payment) return [Strings.ORDER_EMPTY_MODE_OF_PAYMENT, "mode_of_payment"];
    // If quantity is empty
    if (!data.quantity) return [Strings.ORDER_EMPTY_QUANTITY, "quantity"];

    // If mode of payment is GCash
    if (data.mode_of_payment == ModeOfPayment.GCASH) {
      // Check if photo/proof is present
      if (!data.proof) return [Strings.ORDER_EMPTY_PROOF, "proof"];
    }
    
    // If not logged in 
    if (!isLoggedIn) {
      // Check student id
      if (!data.student_id) return [Strings.ORDER_EMPTY_STUDENT_ID, "student_id"];
      // Check student first name
      if (!data.student_first_name) return [Strings.ORDER_EMPTY_STUDENT_FIRST_NAME, "student_first_name"];
      // Check student last name
      if (!data.student_last_name) return [Strings.ORDER_EMPTY_STUDENT_LAST_NAME, "student_last_name"];
      // Check student email
      if (!data.student_email) return [Strings.ORDER_EMPTY_STUDENT_EMAIL, "student_email"];
      // Check student course
      if (!data.student_course) return [Strings.ORDER_EMPTY_STUDENT_COURSE, "student_course"];
      // Check student year
      if (!data.student_year) return [Strings.ORDER_EMPTY_STUDENT_YEAR, "student_year"];

      // Check if student ID contains alpha chars
      if (data.student_id.match(/[A-Za-z]/)) return [Strings.ORDER_INVALID_STUDENT_ID, "student_id"];
      // Check if student ID has only 8 digits
      if (data.student_id.length !== 8) return [Strings.ORDER_LENGTH_STUDENT_ID, "student_id"];
      // Check if email is valid
      if (!isEmail(data.student_email)) return [Strings.ORDER_INVALID_STUDENT_EMAIL, "student_email"];
    }
  }
}

export default Order;