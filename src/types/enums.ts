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
  HASH_ERROR,
  REQUEST_ID,
  REQUEST_KEY,
  REQUEST_VALUE,
  REQUEST_KEY_NOT_ALLOWED,
  UNAUTHORIZED,
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
  CANCELLED = 3,
  REMOVED = 4,
  REJECTED = 5
}

// Mode of payments
export enum ModeOfPayment {
  WALK_IN = 1,
  GCASH = 2
}
