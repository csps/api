export enum Tables {
  STUDENTS = "students",
  EVENTS = "events",
  PRODUCTS = "products",
  TUTORIALS = "tutorials"
}

export enum StudentColumns {
  ID = "id",
  STUDENT_ID = "student_id",
  LAST_NAME = "last_name",
  FIRST_NAME = "first_name",
  YEAR_LEVEL = "year_level",
  EMAIL_ADDRESS = "email_address",
  BIRTH_DATE = "birth_date",
  PASSWORD = "password",
  DATE_STAMP = "date_stamp",
};

export enum EventColumns {
  ID = "id",
  YEAR = "year",
  THUMBNAIL = "thumbnail",
  TITLE = "title",
  DESCRIPTION = "description",
  DATE = "date",
  START_TIME = "start_time",
  END_TIME = "end_time",
  VENUE = "venue",
  DATE_STAMP = "date_stamp",
}

export enum ProductColumns {
  ID = "id",
  NAME = "name",
  THUMBNAIL = "thumbnail",
  SHORT_DESCRIPTION = "short_description",
  DESCRIPTION = "description",
  IMAGE = "image",
  LIKES = "likes",
  STOCK = "stock",
  VARIATIONS = "variations",
  PRICE = "price",
  DATE_STAMP = "date_stamp",
}

export enum ProductVariationColumns {
  ID = "id",
  PRODUCTS_ID = "products_id",
  PHOTO_ID = "photos_id",
  NAME = "name",
}

export enum PhotoColumns {
  ID = "id",
  DATA = "data",
  WIDTH = "width",
  HEIGHT = "height",
  DATE_STAMP = "date_stamp",
}

export enum TutorialColumns {
  ID = "id",
  STUDENT_ID = "student_id",
  LANGUAGE = "language",
  SCHEDULE = "schedule",
  STATUS = "status",
  STATUS_DATE_STAMP = "status_date_stamp",
  REMAKRS = "remarks",
  DATE_STAMP = "date_stamp"
}

export enum OrderColumns {
  ID = "id",
  STUDENTS_ID = "students_id",
  PRODUCT_VARIATIONS_ID = "product_variations_id",
  QUANTITY = "quantity",
  MODE_OF_PAYMENT_ID = "mode_of_payment_id",
  STATUS_ID = "status_id",
  USER_REMARKS = "user_remarks",
  ADMIN_REMARKS = "admin_remarks",
  STATUS_UPDATED = "status_updated",
  EDIT_DATE = "edit_date",
  DATE_STAMP = "date_stamp"
}