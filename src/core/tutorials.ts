import type { Request, Response } from "express";
import Tutorial from "../db/models/tutorial";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";

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

export function getTutorials(request: Request, response: Response) {
  const { year } = request.params;

  if (year) {
    getTutorial(year, request, response)
    return
  }

  Tutorial.getAll((error, tutorial) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting tutorials from database."));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("No tutorials found."));
      return;
    }

    // Return the events
    response.send(result.success("Tutorials found!", tutorial));
  })
}

export function getTutorial(year: string, request: Request, response: Response) {
  Tutorial.getByAcademicYear(year, (error, tutorials) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error("Error getting tutorials from database."));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error("No tutorials found."));
      return;
    }
    
    const yearDate = parseInt(year);
    
    if (!isNaN(yearDate)) {
      const tutorialsResult: Tutorial[] = [];
      const dateFrom = `08/01/${year}`; // sem start August 1
      const dateTo = `07/01/${yearDate + 1}`; // sem end July 1
      const d1 = dateFrom.split("/");
      const d2 = dateTo.split("/");
      const from = new Date(parseInt(d1[2]), parseInt(d1[0]) - 1, parseInt(d1[1]));  // -1 because months are from 0 to 11
      const to = new Date(parseInt(d2[2]), parseInt(d2[0]) - 1, parseInt(d2[1]));

      if (tutorials != undefined) {
        for (let i = 0; i < tutorials?.length; i++) {
          var tempDate = tutorials[i].getDateStamp.split(" ");
          var current = tempDate[0].split("-");
          var check = new Date(parseInt(current[0]), parseInt(current[1]) - 1, parseInt(current[2]));
          console.log(from);
          console.log(to);

          if (check >= from && check < to) {
            tutorialsResult.push(tutorials[i])
          }
        }
      }

      // Return the events
      return response.send(result.success("Tutorials found!", tutorialsResult));
    }
  })
}

function postTutorial(request: Request, response: Response) {
  // Insert the student to the database
  Tutorial.insert(request.body, (error, tutorial) => {
    // If has an error
    switch (error) {
      case ErrorTypes.DB_ERROR:
        response.status(500).send(result.error("Error inserting tutorial to database."));
        return;
    }

    // Otherwise, return the student data
    response.send(result.success("Tutorial created!", null));
  });
}