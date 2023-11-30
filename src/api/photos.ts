import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";

import { status501 } from "../routes";
import { setHeader } from "../utils/security";
import response from "../utils/response";
import Strings from "../config/strings";
import Photo from "../db/models/photo";

/**
 * Photos API
 * @author mavyfaby (Maverick Fabroa)
 */
export function photos(context: ElysiaContext): Promise<ResponseBody | File | undefined> | ResponseBody  {
  switch (context.request.method) {
    case 'GET':
      return getPhotos(context);
    case 'POST':
      return postPhotos(context);
  }

  return status501(context);
}

/**
 * GET /photos
 * @param context Elysia context
 */
async function getPhotos(context: ElysiaContext) {
  // Get hash from request parameters
  const { hash } = context.params || {};
  
  // If id is not specified
  if (!hash) {
    context.set.status = 400;
    return response.error(Strings.PHOTO_INVALID_ID);
  }

  try {
    // Get photo
    const photo = await Photo.getByHash(hash);
    // Set content type
    setHeader(context, 'content-type', photo.type);
    // Return photo
    return photo;
  }

  // If no photo found
  catch (err) {
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.PHOTO_NOT_FOUND);
    }

    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.PHOTO_GET_ERROR);
    }
  }
}

/**
 * POST /photos
 * @param context Elysia context
 */
async function postPhotos(context: ElysiaContext) {
  // Get photo from request
  const { photo } = context.body || {};

  // If photo is not specified
  if (!photo) {
    context.set.status = 400;
    return response.error(Strings.PHOTO_REQUEST_FILE);
  }

  try {
    // Insert photo
    const hash = await Photo.insert(photo);
    // Return hash
    return response.success(Strings.PHOTO_CREATED, { hash });
  }

  // If error
  catch (err) {
    if (err === ErrorTypes.REQUEST_FILE) {
      context.set.status = 400;
      return response.error(Strings.PHOTO_REQUEST_FILE);
    }

    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.PHOTO_POST_ERROR);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 500;
      return response.error(Strings.PHOTO_POST_ERROR);
    }
  }
}
