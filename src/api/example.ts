import { status501 } from "../routes";
import { ElysiaContext, ResponseBody } from "../types";

import response from "../utils/response";

/**
 * Handle request for path /example
 * @param request 
 * @param response 
 */
export function example(context: ElysiaContext) {
  /**
   * Note: Only include methods that are specified in the routes.
   */
  switch (context.request.method) {
    case "GET":
      return getExample(context);
    case "POST":
      return postExample(context);
    case "DELETE":
      return deleteExample(context);
    case "PUT":
      return putExample(context);
  }

  return status501(context);
}

/**
 * GET /example (read)
 */
function getExample(context: ElysiaContext): ResponseBody {
  return response.success("I'm a GET request!");
}

/**
 * POST /example (create)
 */
function postExample(context: ElysiaContext): ResponseBody {
  return response.success("I'm a POST request!", { name: "Example" });
}

/**
 * DELETE /example (delete)
 */
function deleteExample(context: ElysiaContext): ResponseBody {
  return response.success("I'm a DELETE request!");
}

/**
 * PUT /example (update)
 */
function putExample(context: ElysiaContext): ResponseBody {
  return response.success("I'm a PUT request!");
}
