export enum Tables {
  ANNOUNCEMENTS = "announcements",
  ENV = "env",
  EVENTS = "events",
  EDIT_LOGS = "edit_logs",
  ORDERS = "orders",
  ORDERS_GUEST = "orders_guest",
  PHOTOS = "photos",
  PRODUCT_VARIATIONS = "product_variations",
  PRODUCTS = "products",
  RESET_TOKENS = "reset_tokens",
  LOGIN_LOGS = "login_logs",
  STUDENTS = "students",
  TUTORIALS = "tutorials",
  VARIATIONS = "variations",
  GCASH_UPLOADS = "gcash_uploads",
}

export enum AnnouncementsColumn {
  ID = "id",
  ADMIN_STUDENT_ID = "admin_student_id",
  TITLE = "title",
  CONTENT = "content",
  PHOTOS_HASH = "photos_hash",
  DATE_STAMP = "date_stamp",
}

export enum EnvColumn {
  ID = "id",
  KEY = "key",
  VALUE = "value",
  DATE_STAMP = "date_stamp",
}

export enum EditLogsColumn {
  ID = "id",
  ADMIN_ID = "admin_id",
  METHOD = "method",
  TABLE = "table",
  BEFORE = "before",
  AFTER = "after",
  DATE_STAMP = "date_stamp",
}

export enum EventsColumn {
  ID = "id",
  PHOTOS_HASH = "photos_hash",
  TITLE = "title",
  DESCRIPTION = "description",
  DATE = "date",
  START_TIME = "start_time",
  END_TIME = "end_time",
  VENUE = "venue",
  DATE_STAMP = "date_stamp",
}

export enum OrdersColumn {
  ID = "id",
  REFERENCE = "reference",
  UNIQUE_ID = "unique_id",
  STUDENTS_ID = "students_id",
  STUDENTS_GUEST_ID = "students_guest_id",
  PRODUCTS_ID = "products_id",
  VARIATIONS_ID = "variations_id",
  QUANTITY = "quantity",
  MODE_OF_PAYMENT = "mode_of_payment",
  STATUS = "status",
  USER_REMARKS = "user_remarks",
  ADMIN_REMARKS = "admin_remarks",
  STATUS_UPDATED = "status_updated",
  EDIT_DATE = "edit_date",
  DATE_STAMP = "date_stamp"
}

export enum StudentsGuestColumn {
  ID = "id",
  student_id = "student_id",
  first_name = "first_name",
  last_name = "last_name",
  email_address = "email_address",
  course = "course",
  year_level = "year_level",
  date_stamp = "date_stamp",
}

export enum PhotosColumn {
  ID = "id",
  NAME = "name",
  DATA = "data",
  TYPE = "type",
  DATE_STAMP = "date_stamp",
}

export enum GcashUploadsColumn {
  ID = "id",
  REFERENCE = "reference",
  NAME = "name",
  DATA = "data",
  TYPE = "type",
  DATE_STAMP = "date_stamp",
}

export enum ProductVariationColumns {
  ID = "id",
  PRODUCTS_ID = "products_id",
  VARIATIONS_ID = "variations_id",
  STOCK = "stock",
  PHOTOS_HASH = "photos_hash",
}

export enum ProductsColumn {
  ID = "id",
  NAME = "name",
  PHOTOS_HASH = "photos_hash",
  DESCRIPTION = "description",
  LIKES = "likes",
  STOCK = "stock",
  PRICE = "price",
  MAX_QUANTITY = "max_quantity",
  IS_AVAILABLE = "is_available",
  DATE_STAMP = "date_stamp",
}

export enum ResetTokensColummn {
  ID = "id",
  STUDENTS_ID = "students_id",
  TOKEN = "token",
  IS_USED = "is_used",
  RESET_DATE_STAMP = "reset_date_stamp",
  DATE_STAMP = "date_stamp",
}

export enum StudentsColumn {
  ID = "id",
  STUDENT_ID = "student_id",
  LAST_NAME = "last_name",
  FIRST_NAME = "first_name",
  YEAR_LEVEL = "year_level",
  EMAIL_ADDRESS = "email_address",
  PASSWORD = "password",
  DATE_STAMP = "date_stamp",
};

export enum UnivStudentsColumn {
  ID = "id",
  STUDENT_ID = "student_id",
  LAST_NAME = "last_name",
  FIRST_NAME = "first_name",
  YEAR_LEVEL = "year_level",
  COURSE_ID = "course_id",
  EMAIL_ADDRESS = "email_address",
  PASSWORD = "password",
  DATE_STAMP = "date_stamp",
};

export enum VariationsColumn {
  ID = "id",
  NAME = "name"
}