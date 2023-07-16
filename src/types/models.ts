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
  dateStamp?: string;
  variations: ProductVariation[];
}

/**
 * Event type data
 */
export type EventType = {
  id: number;
  title: String;
  description: String;
  thumbnail: Number;
  date: Date;
  startTime: Date;
  endTime: Date;
  venue: String;
  dateStamp?: string;
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
  productID: number;
  variationType: number;
  photoID: number;
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
  dateStamp?: string;
}
