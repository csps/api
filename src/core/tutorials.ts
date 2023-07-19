import type { Request, Response } from "express";
import Tutorial from "../db/models/tutorial";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import { isNumber } from "../utils/string";

import {
  TUTORIALS_FOUND, TUTORIALS_NOT_FOUND, TUTORIALS_GET_ERROR,
  TUTORIAL_POST_ERROR, TUTORIAL_CREATED, TUTORIALS_INVALID_YEAR,
  TUTORIAL_GET_ERROR, TUTORIAL_NOT_FOUND, TUTORIAL_FOUND
} from "../strings/strings.json";
import { getPattern } from "../utils/route";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */
export function tutorials(request: Request, response: Response) {
  switch (request.method) {
    case 'GET':
      getTutorials(request, response)
      break;
    case 'POST':
      postTutorial(request, response)
      break;
  }
}

/**
 * GET /tutorials
 * @param request 
 * @param response 
 */
export function getTutorials(request: Request, response: Response) {
  // Get pattern
  const pattern = getPattern(request.originalUrl);

  // If using year
  if (pattern?.endsWith("/year")) {
    // Get year
    const { year } = request.params;

    // If year is not a number
    if (!isNumber(year)) {
      response.status(404).send(result.error(TUTORIALS_INVALID_YEAR));
      return;
    }

    // Get tutorials by year
    getTutorialsByAcademicYear(parseInt(year), request, response)
    return
  }

  // If using id
  if (pattern?.endsWith("/id")) {
    // Get id
    const { id } = request.params;

    // If id is not a number
    if (!isNumber(id)) {
      response.status(404).send(result.error(TUTORIALS_NOT_FOUND));
      return;
    }

    // Get tutrial by id
    getTutorialById(parseInt(id), request, response);
    return;
  }

  // Otherwise, get all tutorials
  Tutorial.getAll((error, tutorials) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(TUTORIALS_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(TUTORIALS_NOT_FOUND));
      return;
    }

    // Return the events
    response.send(result.success(TUTORIALS_FOUND, tutorials));
  })
}

/**
 * GET /tutorials/year/:year
 * @param year 
 * @param request 
 * @param response 
 */
export function getTutorialsByAcademicYear(year: number, request: Request, response: Response) {
  // Get tutorials by academic year
  Tutorial.fromAcademicYear(year, (error, tutorials) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(TUTORIALS_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(TUTORIALS_NOT_FOUND));
      return;
    }
    
    // Return the events
    return response.send(result.success(TUTORIALS_FOUND, tutorials));
  })
}

/**
 * GET /tutorials/id/:id
 * @param id
 * @param request 
 * @param response 
 */
export function getTutorialById(id: number, request: Request, response: Response) {
  // Get tutorial by id
  Tutorial.fromId(id, (error, tutorial) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(TUTORIAL_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(TUTORIAL_NOT_FOUND));
      return;
    }

    // Return the tutorial
    response.send(result.success(TUTORIAL_FOUND, tutorial));
  })
}

/**
 * POST /tutorials
 * @param request
 * @param response
 */
function postTutorial(request: Request, response: Response) {
  // Insert the student to the database
  Tutorial.insert(request.body, (error, tutorial) => {
    // If has an error
    switch (error) {
      // If has an error
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error(TUTORIAL_POST_ERROR));
        return;
    }

    // Otherwise, return the student data
    response.send(result.success(TUTORIAL_CREATED, null));
  });
}