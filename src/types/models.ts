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
  thumbnail: string;
  short_description: string;
  likes: number;
  stock: number;
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

/**
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
