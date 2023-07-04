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
  DATE_STAMP = "date_stamp",
}

export enum TutorialColumns{
  ID = "id",
  STUDENT_ID = "student_id",
  LANGUAGE = "language",
  SCHEDULE = "schedule",
  STATUS = "status",
  STATUS_DATE_STAMP = "status_date_stamp",
  REMAKRS = "remarks",
  DATE_STAMP = "date_stamp"
}
