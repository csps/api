import type { Request, Response } from "express";
import Tutorial from "../db/models/tutorial";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import { isNumber } from "../utils/string";

import {
  TUTORIALS_FOUND, TUTORIALS_NOT_FOUND, TUTORIALS_GET_ERROR,
  TUTORIAL_POST_ERROR, TUTORIAL_CREATED, TUTORIALS_INVALID_YEAR
} from "../strings/strings.json";

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
  const { year } = request.params;

  if (year) {
    if (!isNumber(year)) {
      response.status(404).send(result.error(TUTORIALS_INVALID_YEAR));
      return;
    }

    getTutorial(parseInt(year), request, response)
    return
  }

  Tutorial.getAll((error, tutorial) => {
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
    response.send(result.success(TUTORIALS_FOUND, tutorial));
  })
}

/**
 * GET /tutorials/:year
 * @param year 
 * @param request 
 * @param response 
 */
export function getTutorial(year: number, request: Request, response: Response) {
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
    
    const tutorialsResult: Tutorial[] = [];
    const dateFrom = `08/01/${year}`; // sem start August 1
    const dateTo = `07/01/${year + 1}`; // sem end July 1
    const d1 = dateFrom.split("/");
    const d2 = dateTo.split("/");
    const from = new Date(parseInt(d1[2]), parseInt(d1[0]) - 1, parseInt(d1[1]));  // -1 because months are from 0 to 11
    const to = new Date(parseInt(d2[2]), parseInt(d2[0]) - 1, parseInt(d2[1]));

    if (tutorials != undefined) {
      for (let i = 0; i < tutorials?.length; i++) {
        var tempDate = tutorials[i].getDatestamp().split(" ");
        var current = tempDate[0].split("-");
        var check = new Date(parseInt(current[0]), parseInt(current[1]) - 1, parseInt(current[2]));

        if (check >= from && check < to) {
          tutorialsResult.push(tutorials[i])
        }
      }
    }

    // Return the events
    return response.send(result.success(TUTORIALS_FOUND, tutorialsResult));
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