import { ErrorTypes } from "../types/enums";
import { ElysiaContext, ResponseBody } from "../types";

import Strings from "../config/strings";
import response from "../utils/response";
import Announcement from "../db/models/announcement";
import { status501 } from "../routes";

/**
 * Announcement API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function announcements(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getAnnouncements(context);
    case "POST":
      return postAnnouncements(context);
    case "PUT":
      return putAnnouncements(context);
    case "DELETE":
      return deleteAnnouncements(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /announcements (read)
 */
async function getAnnouncements(context: ElysiaContext) {
  // Get all announcements
  try {
    const announcements = await Announcement.getAll(context.query);
    return response.success(Strings.ANNOUNCEMENTS_FOUND, ...announcements);
  } catch (err) {
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENTS_GET_ERROR);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT_PAGINATION) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENTS_NOT_FOUND_SEARCH);
    }

    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ANNOUNCEMENTS_NOT_FOUND);
    }
  }
}

/**
 * POST /announcements (create)
 */
async function postAnnouncements(context: ElysiaContext) {
  try {
    // Insert new env
    await Announcement.insert(context.body);
    // If no error, env is created
    return response.success(Strings.ANNOUNCEMENT_POST_SUCCESS);
  }

  catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENT_POST_ERROR);
    }
  }
}

/**
 * PUT /announcements (update)
 */
async function putAnnouncements(context: ElysiaContext) {
  // Get id from params
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.GENERAL_INVALID_REQUEST);
  }

  try {
    // Insert new env
    await Announcement.update(id, context.body);
    // If no error, env is created
    return response.success(Strings.ANNOUNCEMENT_UPDATE_SUCCESS);
  }

  catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If announcement not found
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ANNOUNCEMENT_NOT_FOUND);
    }

    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENT_UPDATE_ERROR);
    }
  }
}

/**
 * DELETE /announcements/:id (delete)
 */
async function deleteAnnouncements(context: ElysiaContext) {
  // Get id from params
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.GENERAL_INVALID_REQUEST);
  }

  try {
    // Insert new env
    await Announcement.delete(id);
    // If no error, env is created
    return response.success(Strings.ANNOUNCEMENT_DELETE_SUCCESS);
  }

  catch (err) {
    // If announcement not found
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ANNOUNCEMENT_NOT_FOUND);
    }

    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENT_DELETE_ERROR);
    }
  }
}

export default announcements;
