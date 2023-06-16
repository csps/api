import type { Request, Response } from "express";
import { result } from "../utils/response";

/**
 * Handle 404 Not Found
 * @param request
 * @param response 
 */
export function handleNotFound(request: Request, response: Response) {
    response.status(404).send(result.error('Request Not Found'));
}

/**
 * Handle 401 Unauthorized
 * @param request 
 * @param response 
 */
export function handleUnauthorized(request: Request, response: Response) {
    response.status(401).send(result.error('Unauthorized'));
}

/**
 * Handle Unimplemented Methods
 * @param request 
 * @param response 
 */
export function handleUnimplemented(request: Request, response: Response) {
    response.status(405).send(result.error('Method Not Allowed'));
}