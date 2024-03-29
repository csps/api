// Auth Type
export enum AuthType {
  STUDENT,
  ADMIN,
  ICT_ADMIN,
  COLLEGE_ADMIN
}

// Error types
export enum ErrorTypes {
  DB_ERROR,
  DB_EMPTY_RESULT,
  DB_EMPTY_RESULT_PAGINATION,
  DB_STUDENT_ALREADY_EXISTS,
  DB_EMAIL_ALREADY_EXISTS,
  DB_PRODUCT_ALREADY_EXISTS,
  DB_PRODUCT_NO_STOCK,
  DB_PRODUCT_INSUFFICIENT,
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
  photos_hash = "photos_hash",
  reference = "reference",
  unique_id = "unique_id",
  products_id = "products_id",
  product_name = "product_name",
  product_price = "product_price",
  variations_id = "variations_id",
  variations_name = "variations_name",
  variations_photo_hash = "variations_photo_hash",
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

export enum ICTSTudentEnum {
  id = "id",
  campus_id = "campus_id",
  student_id = "student_id",
  rfid = "rfid",
  course_id = "course_id",
  tshirt_size_id = "tshirt_size_id",
  year_level = "year_level",
  first_name = "first_name",
  last_name = "last_name",
  email = "email",
  discount_code = "discount_code",
  attendance = "attendance",
  payment_confirmed = "payment_confirmed",
  tshirt_claimed = "tshirt_claimed",
  snack_claimed = "snack_claimed",
  kits_claimed = "kits_claimed",
  date_stamp = "date_stamp",
}

export enum EmailType {
  MESSAGE = "message",
  RESET_PASSWORD = "reset_password",
  FORGOT_PASSWORD = "forgot_password",
  ORDER = "order",
  RECEIPT = "receipt",
  ICT_RECEIPT = "ict_receipt",
  ICT_QR = "ict_qr",
}