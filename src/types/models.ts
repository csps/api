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
}

/**
 * Event type data
 */
export type EventType = {
  id: number;
  title: String;
  description: String;
  thumbnail: String;
  date: Date;
  startTime: Date;
  endTime: Date;
  venue: String;
  dateStamp?: string;
};