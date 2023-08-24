import { ModeOfPayment } from "./enums";

/**
 * Product Request
 */
export type ProductRequest = {
  name: string;
  thumbnail: number;
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
  students_id: string,
  students_first_name?: string,
  students_last_name?: string,
  students_email?: string,
  students_course?: number,
  students_year?: number;
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
  data: Buffer;
  type: string;
}