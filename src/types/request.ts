import { ModeOfPayment } from "./enums";

export type ProductRequest = {
  name: string;
  description: string;
  stock: number;
  price: number;
  max_quantity: number;
  variations: string;
  thumbnail: number | File;
}

export type EditLogsModel = {
  id?: number,
  admin_id: number,
  method: string,
  table: string,
  before: string,
  after: string,
  ip_address: string,
  date_stamp?: string,
}

export type EventRequest = {
  id?: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  start_time: string;
  end_time: string;
  thumbnail?: File;
  date_stamp?: string;
}

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

export type AnnouncementRequest = {
  id?: number,
  title: string,
  content: string,
  photo?: File,
  preservePhoto: string,
};

export type PhotoRequest = {
  type: string;
  data: Buffer;
  name?: string;
  reference?: string;
}

export type PaginationRequest = {
  sort_column?: string;
  sort_type?: 'ASC' | 'DESC';
  search_column?: string;
  search_value?: string;
  page?: string;
  limit?: string;
};