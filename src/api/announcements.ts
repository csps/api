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
    // case "PUT":
    //   return putAnnouncements(context);
    // case "DELETE":
    //   return deleteAnnouncements(context);
  }

  return status501(context);
}

/**
 * GET /announcements (read)
 */
async function getAnnouncements(context: ElysiaContext) {
  // Get all announcements
  try {
    const announcements = await Announcement.getAll();
    return response.success(Strings.ANNOUNCEMENTS_FOUND, announcements);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ANNOUNCEMENTS_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
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

export default announcements;