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