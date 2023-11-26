import { ModeOfPayment } from "./enums";

export type AnnouncementRequest = {
  id?: number,
  title: string,
  content: string,
  photo?: File,
  preservePhoto: boolean,
};

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
  proof?: File;
};

export type PaginationRequest = {
  sort?: {
    key: string;
    type: 'ASC' | 'DESC';
  },
  search?: {
    key: string[];
    value: string[];
  },
  page?: number;
  limit?: number;
};

export type PaginationOutput = {
  sort?: string | { key: string[], value: string[] },
  search?: string | { key: string[], value: string[] },
  page?: string;
  limit?: string;
};