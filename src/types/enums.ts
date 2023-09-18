// Auth Type
export enum AuthType {
  STUDENT,
  ADMIN
}

// Error types
export enum ErrorTypes {
  DB_ERROR,
  DB_EMPTY_RESULT,
  DB_STUDENT_ALREADY_EXISTS,
  DB_EMAIL_ALREADY_EXISTS,
  DB_PRODUCT_ALREADY_EXISTS,
  DB_EVENT_ALREADY_EXISTS,
  DB_ORDER_ALREADY_EXISTS,
  DB_UPDATE_EMPTY,
  DB_USED,
  DB_EXPIRED,
  DB_EXIST,
  HASH_ERROR,
  REQUEST_ID,
  REQUEST_KEY,
  REQUEST_VALUE,
  REQUEST_KEY_NOT_ALLOWED,
  UNAUTHORIZED,
  UNAVAILABLE,
  REQUEST_FILE
}

// Tutorial Status
export enum TutorialStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  DONE = "Done"
}

// Order status
export enum OrderStatus {
  PENDING_PAYMENT = 1,
  COMPLETED = 2,
  CANCELLED_BY_USER = 3,
  CANCELLED_BY_ADMIN = 4,
  REMOVED = 5,
  REJECTED = 6
}

// Mode of payments
export enum ModeOfPayment {
  WALK_IN = 1,
  GCASH = 2
}

export enum FullOrderEnum {
  id = "id",
  thumbnail = "thumbnail",
  reference = "reference",
  unique_id = "unique_id",
  products_id = "products_id",
  product_name = "product_name",
  product_price = "product_price",
  variations_id = "variations_id",
  variations_name = "variations_name",
  variations_photo_id = "variations_photo_id",
  quantity = "quantity",
  mode_of_payment = "mode_of_payment",
  student_id = "student_id",
  first_name = "first_name",
  last_name = "last_name",
  email_address = "email_address",
  course = "course",
  year_level = "year_level",
  status = "status",
  user_remarks = "user_remarks",
  admin_remarks = "admin_remarks",
  status_updated = "status_updated",
  edit_date = "edit_date",
  date_stamp = "date_stamp",
}