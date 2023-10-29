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