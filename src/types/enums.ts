// Error types
export enum ErrorTypes {
  DB_ERROR,
  DB_EMPTY_RESULT,
  DB_STUDENT_ALREADY_EXISTS,
  DB_EMAIL_ALREADY_EXISTS,
  DB_PRODUCT_ALREADY_EXISTS,
  DB_EVENT_ALREADY_EXISTS,
  DB_ORDER_ALREADY_EXISTS
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

// String constants
export enum Strings {
  GENERAL_INVALID_REQUEST = "Invalid request!",
  GENERAL_SYSTEM_ERROR = "Oops! A system error occured. Please contact the CSPS server admin.",
  GENERAL_SESSION_ERROR = "Session Error! Please logout and login again.",

  LOGIN_EMPTY_ID = "ID is required!",
  LOGIN_EMPTY_PASSWORD = "Password is required!",
  LOGIN_FAILED = "Oops! Incorrect ID or Password.",
  LOGIN_ERROR_VALIDATING_PASSWORD = "Oops! Error validating password. Please contact the CSPS server admin.",
  LOGIN_SUCCESS = "Login successful",

  EVENTS_GET_ERROR = "Something went wrong while fetching events.",
  EVENTS_NOT_FOUND = "No events found!",
  EVENTS_FOUND = "Events found!",
  EVENT_GET_ERROR = "Something went wrong while fetching event.",
  EVENT_POST_ERROR = "Something went wrong while adding event.",
  EVENT_NOT_FOUND = "Event not found!",
  EVENT_CREATED = "Event succesfully added!",
  EVENT_FOUND = "Event found!",
  EVENT_EMPTY_TITLE = "Title is required!",
  EVENT_EMPTY_THUMBNAIL = "Thumbnail is required!",
  EVENT_EMPTY_DESCRIPTION = "Description is required!",
  EVENT_EMPTY_DATE = "Date is required!",
  EVENT_EMPTY_START_TIME = "Event start time is required!",
  EVENT_EMPTY_END_TIME = "Event end time is required!",
  EVENT_EMPTY_VENUE = "Event venue is required!",
  EVENT_INVALID_DATE = "Invalid event date!",
  EVENT_INVALID_TIME_FORMAT = "Invalid 24-hour time format!",
  EVENT_INVALID_TIME_ORDER = "Start time must be earlier than end time!",

  PHOTO_INVALID_ID = "Invalid Photo ID!",
  PHOTO_GET_ERROR = "Something went wrong while fetching photo.",
  PHOTO_POST_ERROR = "Something went wrong while uploading photo.",
  PHOTO_CREATED = "Photo uploaded!",
  PHOTO_FOUND = "Photo found!",
  PHOTO_NOT_FOUND = "Photo not found!",
  PHOTO_EMPTY_DATA = "Empty photo data!",
  PHOTO_EMPTY_TYPE = "Empty photo type!",
  PHOTO_EMPTY_WIDTH = "Empty photo width!",
  PHOTO_EMPTY_HEIGHT = "Empty photo height!",

  PRODUCTS_GET_ERROR = "Something went wrong while fetching products.",
  PRODUCTS_NOT_FOUND = "No products found!",
  PRODUCTS_FOUND = "Products found!",
  PRODUCT_GET_ERROR = "Something went wrong while fetching product.",
  PRODUCT_POST_ERROR = "Something went wrong while adding product.",
  PRODUCT_ALREADY_EXIST = "Product already exist!",
  PRODUCT_NOT_FOUND = "Product not found!",
  PRODUCT_FOUND = "Product found!",
  PRODUCT_CREATED = "Product succesfully added!",
  PRODUCT_EMPTY_NAME = "Name is required!",
  PRODUCT_EMPTY_SHORT_DESCRIPTION = "Short Description is required!",
  PRODUCT_EMPTY_DESCRIPTION = "Description is required!",
  PRODUCT_EMPTY_PRICE = "Price is required!",
  PRODUCT_EMPTY_STOCK = "Stock is required!",
  PRODUCT_EMPTY_THUMBNAIL = "Thumbnail is required!",
  PRODUCT_LIMIT_SHORT_DESCRIPTION = "Short Description must not exceed 128 characters!",
  PRODUCT_LIMIT_PRICE = "Price must not be below 0!",
  PRODUCT_LIMIT_STOCK = "Stock must not be below 0!",
  PRODUCT_INVALID_PRICE = "Price must be numeric!",
  PRODUCT_INVALID_STOCK = "Stock must be numeric!",
  PRODUCT_INVALID_MAX_QUANTITY = "Max quantity must be numeric!",
  PRODUCT_LIMIT_MAX_QUANTITY = "Max quantity must not be below 0!",
  PRODUCT_INVALID_THUMBNAIL = "Thumbnail must be numeric!",

  STUDENTS_GET_ERROR = "Something went wrong while fetching students.",
  STUDENTS_NOT_FOUND = "No students found!",
  STUDENTS_FOUND = "Students found!",
  STUDENT_GET_ERROR = "Something went wrong while fetching student.",
  STUDENT_POST_ERROR = "Something went wrong while adding student.",
  STUDENT_NOT_FOUND = "Student not found!",
  STUDENT_ALREADY_EXIST = "Student already exist!",
  STUDENT_EMAIL_ALREADY_EXIST = "Student email already exist!",
  STUDENT_CREATED = "Student succesfully added!",
  STUDENT_FOUND = "Student found!",
  STUDENT_EMPTY_ID = "Student ID is required!",
  STUDENT_EMPTY_YEAR_LEVEL = "Year level is required!",
  STUDENT_EMPTY_FIRST_NAME = "First name is required!",
  STUDENT_EMPTY_LAST_NAME = "Last name is required!",
  STUDENT_EMPTY_BIRTHDATE = "Birthdate is required!",
  STUDENT_EMPTY_EMAIL = "Email is required!",
  STUDENT_EMPTY_PASSWORD = "Password is required!",
  STUDENT_LIMIT_ID = "Invalid student ID!",
  STUDENT_LIMIT_YEAR_LEVEL = "Invalid year level!",
  STUDENT_INVALID_BIRTHDATE = "Invalid birthdate!",
  STUDENT_INVALID_EMAIL = "Invalid email address!",
  STUDENT_INVALID_PASSWORD = "Password must be at least 8 characters!",

  TUTORIALS_GET_ERROR = "Something went wrong while fetching tutorials.",
  TUTORIALS_NOT_FOUND = "No tutorials found!",
  TUTORIALS_FOUND = "Tutorials found!",
  TUTORIALS_INVALID_YEAR = "Invalid year!",
  TUTORIAL_GET_ERROR = "Something went wrong while fetching tutorial.",
  TUTORIAL_NOT_FOUND = "Tutorial not found!",
  TUTORIAL_FOUND = "Tutorial found!",
  TUTORIAL_POST_ERROR = "Something went wrong while submitting tutorial request.",
  TUTORIAL_CREATED = "Tutorial succesfully submitted!",

  ORDERS_EMPTY = "No orders found!",
  ORDERS_FOUND = "Orders found!",
  ORDER_INVALID_ID = "Invalid Order ID!",
  ORDER_EMPTY_PRODUCT_VARIATION_ID = "Product Variation is required!",
  ORDER_EMPTY_MODE_OF_PAYMENT = "Mode of Payment is required!",
  ORDER_EMPTY_QUANTITY = "Quantity is required!",
  ORDER_POST_ERROR = "Something went wrong while creating order.",
  ORDER_CREATED = "Order succesfully placed!",
  ORDER_ALREADY_EXISTS = "Order already exist! Please check your orders in the orders page."
}