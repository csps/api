// Error types
export enum ErrorTypes {
  DB_ERROR,
  DB_EMPTY_RESULT,
  DB_STUDENT_ALREADY_EXISTS,
  DB_EMAIL_ALREADY_EXISTS,
  DB_PRODUCT_ALREADY_EXISTS,
  DB_EVENT_ALREADY_EXISTS,
}

// Tutorial Status
export enum TutorialStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  DONE = "Done"
}