import { ModeOfPayment } from "./enums";

/**
 * Product Request
 */
export type ProductRequest = {
  name: string;
  short_description: string;
  description: string;
  stock: number;
  price: number;
  max_quantity: number;
  variations: string;
}

/**
 * Order Request
 */
export type OrderRequest = {
  products_id: number,
  variations_id?: number,
  mode_of_payment: ModeOfPayment,
  quantity: number,
  student_id?: string,
  student_first_name?: string,
  student_last_name?: string,
  student_email?: string,
  student_course?: number,
  student_year?: number;
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
  name?: string;
  receipt_id?: string;
}