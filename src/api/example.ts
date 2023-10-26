import { status501 } from "../routes";
import { ElysiaRequest, ResponseBody } from "../types";

import response from "../utils/response";

/**
 * Handle request for path /example
 * @param request 
 * @param response 
 */
export default function example(data: ElysiaRequest): ResponseBody {
  /**
   * Note: Only include methods that are specified in the routes.
   */
  switch (data.request.method) {
    case "GET":
      return getExample(data);
    case "POST":
      return postExample(data);
    case "DELETE":
      return deleteExample(data);
    case "PUT":
      return putExample(data);
  }

  return status501();
}

/**
 * GET /example (read)
 */
function getExample(data: ElysiaRequest): ResponseBody {
  return response.success("I'm a GET request!");
}

/**
 * POST /example (create)
 */
function postExample(data: ElysiaRequest): ResponseBody {
  return response.success("I'm a POST request!", { name: "Example" });
}

/**
 * DELETE /example (delete)
 */
function deleteExample(data: ElysiaRequest): ResponseBody {
  return response.success("I'm a DELETE request!");
}

/**
 * PUT /example (update)
 */
function putExample(data: ElysiaRequest): ResponseBody {
  return response.success("I'm a PUT request!");
}