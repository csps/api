import type { Request, Response } from "express";
import Tutorial from "../db/models/tutorial";
import { ErrorTypes } from "../types";
import { result } from "../utils/response";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */

export function tutorials(request: Request, response: Response){
    switch (request.method) {
        case 'GET': 
          getTutorials(request, response)
          break;
        case 'POST':
            postTutorial(request, response)
            break;
    }
}

export function getTutorials(request: Request, response: Response){

    if(request.params.year){
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

export function getTutorialByYear(){

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