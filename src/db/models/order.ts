import { FullOrderModel } from "../../types/models";
import { ErrorTypes } from "../../types/enums";

import Database from "..";
import Log from "../../utils/log";

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
      
      o.status, o.user_remarks, IF(o.students_id = 0, 1, 0) AS is_external,
      o.admin_remarks, o.status_updated, o.edit_date, o.date_stamp

    FROM orders o 
    INNER JOIN products p ON p.id = o.products_id
    LEFT JOIN students s ON s.id = o.students_id
    LEFT JOIN students_external se ON se.id = o.students_external_id
    LEFT JOIN product_variations pv ON pv.id = o.variations_id
    LEFT JOIN variations v ON v.id = pv.variations_id
  `;

  /**
 * Get all orders
 */
  public static getAll(): Promise<FullOrderModel[]> {
    return new Promise(async (resolve, reject) => {
      // Get database instance
      const db = Database.getInstance();

      try {
        // Get all orders
        const result = await db.query<FullOrderModel[]>(Order.DEF_QUERY);

        // If no results
        if (result.length === 0) {
          Log.e("No orders found");
          return reject(ErrorTypes.DB_EMPTY_RESULT);
        }

        // Resolve promise
        resolve(result);
      }

      // Log error and reject promise
      catch (e) {
        Log.e(e);
        reject(ErrorTypes.DB_ERROR);
      }
    });
  }

}

export default Order;