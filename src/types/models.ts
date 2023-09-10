import { ModeOfPayment, OrderStatus, TutorialStatus } from "./enums";

export type AnnouncementModel = {
  id: number,
  admin_student_id: string,
  title: string,
  content: string,
  photos_id?: number,
  date_stamp: string
}

export type EnvModel = {
  id: number,
  key: string,
  value: string,
  date_stamp: string,
}

export type EventModel = {
  id: number,
  thumbnail?: number,
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
  students_id: string,
  type: number,
  ip_address: string,
}

export type OrderModel = {
  id: number,
  student_id: string,
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

export type NonBscsOrderModel = {
  id: number,
  receipt_id: string,
  products_id: number,
  variations_id: number,
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
}

export type FullOrderModel = {
  id: string,
  thumbnail: number,
  receipt_id: string,
  products_id: number,
  product_name: string,
  product_price: number,
  variations_id: number,
  variations_name: string,
  variations_photo_id: number,
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
}

export type PhotoModel = {
  id: number,
  name?: string,
  type: string,
  data: Buffer,
  date_stamp: string,
}

export type ReceiptModel = {
  id: number,
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
  photos_id: number,

  // Extra
  name: string,
}

export type ProductModel = {
  id: number,
  name: string,
  thumbnail?: number,
  description: string,
  likes: number,
  stock: number,
  price: number,
  max_quantity: number,
  date_stamp?: string,

  // Extra
  variations: ProductVariationModel[],
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
