import type { Request, Response } from "express";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import { isNumber } from "../utils/string";
import Event from "../db/models/event";
import Strings from "../config/strings";

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

    case 'PUT':
      updateEvent(request,response)
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

  // if ends with /next, call `getNextEvent` function instead
  if (request.originalUrl.endsWith("/next")) {
    getNextEvent(request, response);
    return;
  }

  // If has an id, call `getEvent` function instead
  if (id) {
    getEvent(request, response);
    return;
  }

  // Get all events
  Event.find(request.query, (error, events, count) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.GENERAL_SYSTEM_ERROR));
      return;
    }

    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(200).send(result.error(Strings.EVENTS_NOT_FOUND));
      return;
    }

    if (error === ErrorTypes.REQUEST_KEY_NOT_ALLOWED) {
      response.status(400).send(result.error(Strings.GENERAL_COLUMN_NOT_FOUND));
      return;
    } 

    response.status(200).send(result.success(Strings.EVENTS_FOUND, events, count));
  });
}

/**
 * GET /events/next
 * @param request Express request object
 * @param response Express response object
 */
function getNextEvent(request: Request, response: Response) {
  // Get the next event
  Event.next((error, event) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.EVENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.EVENT_NOT_FOUND));
      return;
    }

    // Return the event
    response.send(result.success(Strings.EVENT_FOUND, event))
  })
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
    response.status(404).send(result.error(Strings.EVENT_NOT_FOUND));
    return;
  }

  // Get the event by its ID
  Event.fromId(parseInt(id), (error, event) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.EVENT_GET_ERROR));
      return;
    }
    
    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.EVENT_NOT_FOUND));
      return;
    }

    // Return the event
    response.send(result.success(Strings.EVENT_FOUND, event))
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
  Event.insert(request.body, request.files, (error, event) => {
    // If has error
    switch(error){
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(Strings.EVENT_POST_ERROR));
        break;
    }
    
    // Otherwise, return the Event Data
    response.send(result.success(Strings.EVENT_CREATED, event));
  });
}

/**
 * PUT /event
 * @param request
 * @param response
 */
function updateEvent(request: Request, response: Response){
  // Validate the Event Data
  const validation = Event.validate(request.body);

  // If has an error
  if (validation){
    response.status(400).send(result.error(validation[0], validation[1]));
    return;
  }

  if (!isNumber(request.params.id)) {
    response.status(404).send(result.error(Strings.EVENT_NOT_FOUND));
    return;
  }

  /**
   * Update the Event Data
   */
  Event.update(request.body, parseInt(request.params.id), (error, event) => {
    // If has error
    switch(error){
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(Strings.EVENT_PUT_ERROR));
        break;
    }
    
    // Otherwise, return the Event Data
    response.send(result.success(Strings.EVENT_UPDATED, event));
  });
}


