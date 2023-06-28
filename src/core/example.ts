/**
 * This is an example of a structure for a mnemonic and clear api functions.
 * @author mavyfaby (Maverick Fabroa)
 */

import type { Request, Response } from "express";
import { result } from "../utils/response";

/**
 * Handle request for path /example
 * @param request 
 * @param response 
 */
export function example(request: Request, response: Response) {
  /**
   * Note: Only include methods that are specified in the routes.
   */
  switch (request.method) {
    case "GET":
      getExample(request, response);
      break;
    case "POST":
      postExample(request, response);
      break;
    case "DELETE":
      deleteExample(request, response);
      break;
    case "PUT":
      putExample(request, response);
      break;
  }
}

/**
 * GET /example (read)
 */
function getExample(request: Request, response: Response) {
  response.send(result.success("I'm a GET request!"));
}

/**
 * POST /example (create)
 */
function postExample(request: Request, response: Response) {
  response.send(result.success("I'm a POST request!", { name: "Example" }));
}

/**
 * DELETE /example (delete)
 */
function deleteExample(request: Request, response: Response) {
  response.send(result.error("I'm a DELETE request!"));
}

/**
 * PUT /example (update)
 */
function putExample(request: Request, response: Response) {
  response.send(result.error("I'm a PUT request!"));
}