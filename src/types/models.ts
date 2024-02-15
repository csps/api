import { ModeOfPayment, OrderStatus, TutorialStatus } from "./enums";

export type AnnouncementModel = {
  id: number,
  admin_student_id: string,
  title: string,
  content: string,
  photos_hash?: string,
  date_stamp: string
}

export type CourseModel = {
  id: number,
  name: string,
}

export type EnvModel = {
  id: number,
  key: string,
  value: string,
  date_stamp: string,
}

export type EditLogsModel = {
  id: number,
  admin_id: number | string,
  method: string,
  table: string,
  before: string | object,
  after: string | object,
  ip_address: string,
  date_stamp: string,
}

export type EventModel = {
  id: number,
  photos_hash?: string,
  title: string,
  description: string,
  venue: string,
  date: string,
  start_time: string,
  end_time: string,
  date_stamp: string,
}

export type LoginLogModel = {
  // id: number, // Hide for now
  // date_stamp: string // Hide for now
  name: string,
  student_id: string,
  students_id: string,
  type: number,
  ip_address: string,
}

export type OrderModel = {
  id: number,
  reference: string,
  unique_id: string,
  students_id: number,
  students_guest_id: number,
  products_id: number,
  variations_id: number,
  quantity: number,
  mode_of_payment: ModeOfPayment,
  status: OrderStatus,
  user_remarks: string,
  admin_remarks: string,
  status_updated: string,
  edit_date: string,
  date_stamp: string,
}

export type FullOrderModel = {
  id: string,
  photos_hash: string,
  reference: string,
  unique_id: string,
  products_id: number,
  product_name: string,
  product_price: number,
  variations_id: number,
  variations_name: string,
  variations_photo_hash: number,
  quantity: number,
  mode_of_payment: ModeOfPayment,
  student_id: string,
  first_name: string,
  last_name: string,
  email_address: string,
  course: number,
  year_level: number,
  status: OrderStatus,
  user_remarks: string,
  admin_remarks: string,
  status_updated: string,
  edit_date: string,
  date_stamp: string,
  is_guest: number, // Whether the student is guest (non-bscs) or not
}

export type PhotoModel = {
  id: number,
  name?: string,
  type: string,
  data: Buffer,
  date_stamp: string,
}

export type GCashUploadsModel = {
  id: number,
  reference: string,
  name?: string,
  type: string,
  data: Buffer,
  date_stamp: string,
}

export type ProductVariationModel = {
  id: number,
  products_id: number,
  variations_id: number,
  stock: number,
  photos_hash: string,
  name: string // Extra
}

export type ProductModel = {
  id: number,
  name: string,
  slug: string,
  photos_hash?: string,
  description: string,
  likes: number,
  stock: number,
  price: number,
  max_quantity: number,
  is_available: boolean,
  date_stamp?: string,
  variations: ProductVariationModel[] // Extra
}

export type ResetTokenModel = {
  id: number,
  students_id: number,
  token: string,
  is_used: boolean,
  reset_date_stamp?: string,
  date_stamp: string,
}

export type StudentModel = {
  id: number,
  student_id: string,
  last_name: string,
  first_name: string,
  year_level: string,
  email_address: string,
  password?: string,
  date_stamp: string,
}

export type TutorialModel = {
  id: number,
  student_id: string,
  language: string,
  schedule: string,
  status: TutorialStatus,
  status_date_stamp: string,
  remarks: string,
  date_stamp: string,
}

export type VariationModel = {
  id: number,
  name: string,
}

export type ICTStudentModel = {
  id: number;
  campus_id: number;
  student_id: string;
  course_id: number;
  tshirt_size_id: number;
  year_level: string;
  first_name: string;
  last_name: string;
  email: string;
  discount_code: string;
  attendance?: string;
  payment_confirmed?: string;
  tshirt_claimed?: string;
  snack_claimed: number;
  date_stamp: string;
}

export type ICTStudentRegisterModel = {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  discount_code: string;
  tshirt_size_id: number;
  campus_id: number;
  course_id: number;
  year_level: number;
}

export type ICTCourse = {
  id: number;
  course: string;
  course_name: string;
}

export type ICTShirtSize = {
  id: number;
  code: string;
  name: string;
}

export type ICTCampus = {
  id: number;
  campus: string;
  campus_name: string;
}

export type ICTDiscountCode = {
  id: number;
  code: number;
  expiration: string;
}