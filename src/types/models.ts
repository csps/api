import { ModeOfPayment, OrderStatus, TutorialStatus } from "./enums";

export type AnnouncementModel = {
  id: number,
  admin_student_id: string,
  title: string,
  content: string,
  photos_id?: number,
  date_stamp: string
}

export type ConfigModel = {
  id: number;
  key: string;
  value: string;
  date_stamp: string;
}

export type EventModel = {
  id: number;
  thumbnail: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  date_stamp: string;
};

export type OrderModel = {
  id: number;
  students_id: string;
  products_id: number;
  variations_id: number;
  quantity: number;
  mode_of_payment: ModeOfPayment;
  status: OrderStatus;
  user_remarks: string;
  admin_remarks: string;
  status_updated: string;
  edit_date: string;
  date_stamp: string;
}

export type PhotoModel = {
  id: number;
  type: string;
  data: Buffer;
  date_stamp: string;
}

export type ProductVariationModel = {
  id: number;
  products_id: number;
  variations_id: number;
  photos_id: number;

  // Extra
  name: string;
}

export type ProductModel = {
  id: number;
  name: string;
  thumbnail?: number;
  short_description: string;
  description: string;
  likes: number;
  stock: number;
  price: number;
  max_quantity: number;
  date_stamp?: string;

  // Extra
  variations: ProductVariationModel[];
}

export type ResetTokenModel = {
  id: number;
  students_id: number;
  token: string;
  is_used: boolean;
  reset_date_stamp?: string;
  date_stamp: string;
}

export type StudentModel = {
  id: number;
  student_id: string;
  last_name: string;
  first_name: string;
  year_level: string;
  email_address: string;
  birth_date: string;
  password?: string;
  date_stamp: string;
}

export type TutorialModel = {
  id: number;
  student_id: string;
  language: string;
  schedule: string;
  status: TutorialStatus;
  status_date_stamp: string;
  remarks: string;
  date_stamp: string;
};

export type VariationModel = {
  id: number;
  name: string;
};

/**
 * Announcement Request
 */
export type AnnouncementRequest = {
  title: string,
  content: string,
  photo_data?: string;
  photo_type?: string;
};

/**
 * Photo request
 */
export type PhotoRequest = {
  type: string;
  data: Buffer;
}