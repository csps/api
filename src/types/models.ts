import { TutorialStatus } from "./enums";

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
  date_stamp?: string;
  variations: ProductVariation[];
}

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
