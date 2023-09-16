import { FileArray, UploadedFile } from "express-fileupload";

/**
 * Get uploaded file
 */
export function getFile(files: FileArray | null | undefined, name: string): UploadedFile | null {
  if (!files) return null;

  const file: UploadedFile | UploadedFile[] = files[name];

  if (!file) return null;

  if (Array.isArray(file)) {
    return file[0];
  }

  return file;
}