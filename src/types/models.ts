import { ModeOfPayment, OrderStatus, TutorialStatus } from "./enums";

/**
 * Student type data
 */
export type StudentType = {
  id: number;
  student_id: string;
  last_name: string;
  first_name: string;
  year_level: string;
  email_address: string;
  birth_date: string;
  password?: string;
  date_stamp?: string;
}

/**
 * Product type data
 */
export type ProductType = {
  id: number;
  name: string;
  thumbnail: number;
  short_description: string;
  description: string;
  likes: number;
  stock: number;
  price: number;
  max_quantity: number;
  date_stamp?: string;
  variations: ProductVariation[];
}

/**
 * Product Variation data
 */
export type ProductVariation = {
  id: number;
  product_id: number;
  product_variation_types_id: number;
  photos_id: number;
  name: string;
};

/**
 * Event type data
 */
export type EventType = {
  id: number;
  thumbnail: Number;
  title: String;
  description: String;
  date: string;
  start_time: string;
  end_time: string;
  venue: String;
  date_stamp?: string;
};

export type TutorialType = {
  id: number;
  student_id: string;
  language: string;
  schedule: string;
  status: TutorialStatus;
  status_date_stamp: string;
  remarks: string;
  date_stamp: string;
};

 /*
 * Photo type data
 */
export type PhotoType = {
  id: number;
  data: Buffer;
  type: string;
  width: number;
  height: number;
  date_stamp?: string;
}

/**
 * Order type data
 */
export type OrderType = {
  id: number;
  student_id: string;
  product_variations_id: number;
  quantity: number;
  mode_of_payment_id: ModeOfPayment;
  status_id: OrderStatus;
  user_remarks: string;
  admin_remarks: string;
  status_updated: string;
  edit_date: string;
  date_stamp: string;
}

/**
 * Reset Password Tokens type data
 */
export type ResetPasswordTokensType = {
  id: number;
  students_id: number;
  token: string;
  is_used: boolean;
  reset_date_stamp: string;
  date_stamp: string;
}

export type AnnouncementType = {
  id: number,
  title: string,
  content: string,
  photo_id: number,
  date_stamp: string
}