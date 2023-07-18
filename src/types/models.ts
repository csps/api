/**
 * Student type data
 */
export type StudentType = {
  id: string;
  rid?: number;
  email: string;
  firstName: string;
  lastName: string;
  yearLevel: string;
  birthdate: string;
  password?: string;
  dateStamp?: string;
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
  student_id: String;
  language: String;
  schedule: String;
  status: String;
  status_date_stamp: String;
  remarks: String;
  date_stamp: String;
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
