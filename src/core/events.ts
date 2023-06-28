import Event from "../db/models/event";
import { ErrorTypes } from "../types";
import { result } from "../utils/response";
import type { Request, Response } from "express";

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
export function getEvents(request: Request, response: Response) {
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
