import type { Response, Request } from "express";
import { result } from "../utils/response";
import { ErrorTypes } from "../types";
import { isNumber } from "../utils/string";
import Event from "../db/models/event";

/**
 * Event API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */
export function event(request: Request, response: Response) {
  switch (request.method) {
    case 'GET':
      getEvent(request, response)
      break;
  }
}

/**
 * GET /events/:id
 * @param request Express request object
 * @param response Express response object
 */
export function getEvent(request: Request, response: Response) {
  // Get the event ID
  const { id } = request.params;

  // If id is not a number, return event not found
  if (!isNumber(id)) {
    response.status(404).send(result.error("Event not found!"));
    return;
  }

  // Get the event by its ID
  Event.fromId(parseInt(id), (error, event) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting event from database."));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("Event not found."));
      return;
    }

    // Return the event
    response.send(result.success(event))
  })
}

