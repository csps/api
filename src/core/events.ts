import Event from "../db/models/event";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import { isNumber } from "../utils/string";
import type { Request, Response } from "express";

import {
  EVENTS_GET_ERROR, EVENTS_NOT_FOUND, EVENTS_FOUND,
  EVENT_GET_ERROR, EVENT_NOT_FOUND, EVENT_FOUND,
  EVENT_CREATED, EVENT_POST_ERROR
} from "../strings/strings.json";

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

    case 'POST':
      postEvents(request,response);
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
      response.status(500).send(result.error(EVENTS_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(EVENTS_NOT_FOUND));
      return;
    }
    
    // Return the events
    response.send(result.success(EVENTS_FOUND, events));
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
    response.status(404).send(result.error(EVENT_NOT_FOUND));
    return;
  }

  // Get the event by its ID
  Event.fromId(parseInt(id), (error, event) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(EVENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(EVENT_NOT_FOUND));
      return;
    }

    // Return the event
    response.send(result.success(EVENT_FOUND, event))
  })
}

/**
 * POST /events
 * @param request
 * @param response
 */
function postEvents(request: Request, response: Response){
  // Validate the Event Data
  const validation = Event.validate(request.body);

  // If has an error
  if (validation){
    response.status(400).send(result.error(validation[0], validation[1]));
    return;
  }

  /**
   * Insert the Event Data
   */
  Event.insert(request.body, (error, event) => {
    // If has error
    switch(error){
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(EVENT_POST_ERROR));
        break;
    }
    
    // Otherwise, return the Event Data
    response.send(result.success(EVENT_CREATED, event));
  });
}

