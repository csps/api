import type { ElysiaContext, ResponseBody } from "../types";
import { ErrorTypes } from "../types/enums";

import Strings from "../config/strings";
import response from "../utils/response";
import Event from "../db/models/event";
import { status501 } from "../routes";

/**
 * Course API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function events(context: ElysiaContext): Promise<ResponseBody | undefined> | ResponseBody {
  switch (context.request.method) {
    case "GET":
      return getEvents(context);
    case "POST":
      return postEvents(context);
    case "PUT":
      return putEvents(context);
    case "DELETE":
      return deleteEvents(context);
    case "OPTIONS":
      return response.success();
  }

  return status501(context);
}

/**
 * GET /events (read)
 */
async function getEvents(context: ElysiaContext) {
  // If accessing /events/next
  if (context.path.endsWith("/next")) {
    // Get next event
    return getEventNext(context);
  }

  // Get all events
  try {
    const events = await Event.getAll(context.query);
    return response.success(Strings.EVENTS_FOUND, ...events);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.EVENTS_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.EVENTS_NOT_FOUND);
    }
  }
}

/**
 * GET /events/next (read)
 */
async function getEventNext(context: ElysiaContext) {
  // Get next event
  try {
    const event = await Event.getNext();
    return response.success(Strings.EVENT_FOUND, event);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.EVENTS_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 200;
      return response.error(Strings.EVENT_EMPTY_NEXT);
    }
  }
}

/**
 * POST /events (create)
 */
async function postEvents(context: ElysiaContext) {
  try {
    // Insert new env
    await Event.insert(context.body);
    // If no error, env is created
    return response.success(Strings.EVENT_CREATED);
  } catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.EVENT_POST_ERROR);
    }
  }
}

/**
 * PUT /events/:id (update)
 */
async function putEvents(context: ElysiaContext) {
  // Get id from request body
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.GENERAL_INVALID_REQUEST);
  }

  try {
    // Update event
    await Event.update(id, context.body);
    // If no error, env is updated
    return response.success(Strings.EVENT_UPDATED);
  } catch (err) {
    // if list of errors
    if (Array.isArray(err)) {
      context.set.status = 400;
      return response.error(err[0], err[1]);
    }

    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.EVENT_PUT_ERROR);
    }
  }
}

/**
 * DELETE /events/:id (delete)
 */
async function deleteEvents(context: ElysiaContext) {
  // Get id from request params
  const { id } = context.params || {};

  // If id is empty
  if (!id) {
    context.set.status = 400;
    return response.error(Strings.GENERAL_INVALID_REQUEST);
  }

  try {
    // Delete event
    await Event.delete(id);
    // If no error, env is deleted
    return response.success(Strings.EVENT_DELETED);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.EVENT_DELETE_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.EVENT_NOT_FOUND);
    }
  }
}

export default events;