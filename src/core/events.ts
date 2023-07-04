import Event from "../db/models/event";
import { ErrorTypes } from "../types";
import { result } from "../utils/response";
import type { Request, Response } from "express";
import { isNumber } from "../utils/string";

/**
 * Events API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */
export function events(request: Request, response: Response) {
  switch (request.method) {
    case 'GET': 
      getEvents(request, response)
      break;
  }
}

/**
 * GET /events
 * @param request Express request object
 * @param response Express response object
 */
function getEvents(request: Request, response: Response) {
  // Get {id} from request parameters
  const { id } = request.params;

  // If has an id, call `getEvent` function instead
  if (id) {
    getEvent(request, response);
    return;
  }

  // Get all events
  Event.getAll((error, events) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting events from database."));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("No events found."));
      return;
    }
    
    // Return the events
    response.send(result.success("Events found!", events));
  });
}

/**
 * GET /events/:id
 * @param request Express request object
 * @param response Express response object
 */
function getEvent(request: Request, response: Response) {
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

