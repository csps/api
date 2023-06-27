import type { Response, Request } from "express";
import { result } from "../utils/response";
import Event from "../db/models/event";
import { ErrorTypes } from "../types";

export function event(request: Request, response: Response){
    switch (request.method) {
        case 'GET':
            getEvent(request,response)
            break;
    }
}

export function events(request: Request, response: Response){
    switch (request.method) {
        case 'GET':
            getEvents(request,response)
            break;
    }

}

export function getEvent(request: Request, response: Response){
    const eventId = request.params.id

    Event.fromId(Number(eventId), (err,event)=>{
        if(err === ErrorTypes.DB_ERROR){
           response.send(result.error("Database Error")) 
        }else if(err === ErrorTypes.DB_EMPTY_RESULT){
            response.send(result.error("Event not found"))
        }else{
            response.send(result.success(event))
        }
    })
}

export function getEvents(request: Request, response: Response){

    Event.getEvents((err,event)=>{
        if(err === ErrorTypes.DB_ERROR){
           response.send(result.error("Database Error")) 
        }else if(err === ErrorTypes.DB_EMPTY_RESULT){
            response.send(result.error("Event not found"))
        }else{
            response.send(result.success(event))
        }
    })
}


