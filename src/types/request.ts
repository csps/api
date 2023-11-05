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
  sort?: string,
  search?: string,
  page?: string;
  limit?: string;
};