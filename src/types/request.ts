export type AnnouncementRequest = {
  id?: number,
  title: string,
  content: string,
  photo?: File,
  preservePhoto: boolean,
};
