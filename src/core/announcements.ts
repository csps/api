import Strings from "../config/strings";
import Announcement from "../db/models/announcement";
import { ErrorTypes } from "../types/enums";
import { result } from "../utils/response";
import type { Request, Response } from "express";
import { getPattern } from "../utils/route";
import { isNumber } from "../utils/string";

/**
 * Tutorials API
 * @author TotalElderBerry (Brian Keith Lisondra)
 * 
 * @param request Express request object
 * @param response Express response object
 */

export function announcements(request: Request, response: Response) {
    switch (request.method) {
      case 'GET':
        getAnnouncements(request,response);
        break;
      case 'POST':
        break;
      case 'PUT':
        break;
      case 'DELETE':
        break;
    }
  }

export function getAnnouncements(request: Request, response: Response){

  const pattern = getPattern(request.originalUrl);
  // If using year
  if (pattern?.endsWith("/academic_year")) {
    // Get academic_year
    const { academic_year } = request.params;

    // If academic_year is not a number
    if (!isNumber(academic_year)) {
      response.status(404).send(result.error(Strings.ANNOUNCEMENTS_INVALID_ACADEMIC_YEAR));
      return;
    }

    // Get tutorials by academic_year
    getAnnouncementsByAcademicYear(parseInt(academic_year),request,response);
    return
  }

  Announcement.getAll((error, announcements) => {
    // If has an error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ANNOUNCEMENTS_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ANNOUNCEMENTS_NOT_FOUND));
      return;
    }

    // Return the events
    response.send(result.success(Strings.ANNOUNCEMENTS_FOUND, announcements));
  })
}

export function getAnnouncementsByAcademicYear(year: number, request: Request, response: Response) {
  // Get tutorials by academic year
  Announcement.fromAcademicYear(year, (error, announcements) => {
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ANNOUNCEMENTS_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ANNOUNCEMENTS_NOT_FOUND));
      return;
    }
    
    // Return the events
    return response.send(result.success(Strings.ANNOUNCEMENTS_FOUND, announcements));
  })
}

export function deleteAnnouncement(request: Request, response: Response){
  const { academic_year } = request.params;
  if (!isNumber(academic_year)) {
    response.status(404).send(result.error(Strings.ANNOUNCEMENTS_INVALID_ACADEMIC_YEAR));
    return;
  }
  Announcement.delete(parseInt(academic_year),(error,success) => {
    if(success){
      response.send(result.success("Success"))
      return
    }

    response.send(result.error("Failed"))
  })
}

