import type { Request, Response } from "express";
import { result } from "../utils/response";
import { Env } from "../db/models/env";
import { ErrorTypes } from "../types/enums";
import Strings from "../config/strings";

/**
 * Env API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function env(request: Request, response: Response) {
  switch (request.method) {
    case "GET":
      getEnv(request, response);
      break;
    case "POST":
      postEnv(request, response);
      break;
    case "DELETE":
      deleteEnv(request, response);
      break;
    case "PUT":
      putEnv(request, response);
      break;
  }
}

/**
 * GET /env (read)
 */
function getEnv(request: Request, response: Response) {
  // Getting params 
  const { key } = request.params;

  // If has a key
  if (key) {
    // Call `getEnvByKey` function instead
    getEnvByKey(request, response);
    return;
  }

  // Get all env variables
  Env.getAll((error, env) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ENV_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ENV_NOT_FOUND));
      return;
    }

    // Return env
    response.send(result.success(Strings.ENV_FOUND, env));
  });
}

/**
 * GET /env/:key (read) 
 */
function getEnvByKey(request: Request, response: Response) {
  // Getting params 
  const { key } = request.params;

  // If has no key
  if (!key) {
    response.status(400).send(result.error("Key is required!"));
    return;
  }

  // Get env by key
  Env.fromKey(key, (error, value) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ENV_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ENV_NOT_FOUND));
      return;
    }

    // Return the value
    response.send(result.success(Strings.ENV_FOUND, value));
  });
}

/**
 * POST /env (create)
 */
function postEnv(request: Request, response: Response) {
  // Get key and value from request body
  const { key, value } = request.body;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.ENV_EMPTY_KEY));
    return;
  }

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.ENV_EMPTY_VALUE));
    return;
  }

  // Insert config
  Env.insert(key, value, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ENV_POST_ERROR));
      return;
    }

    // If already exists
    if (error === ErrorTypes.DB_EXIST) {
      response.status(400).send(result.error(Strings.ENV_EXISTS));
      return;
    }

    // Return success
    response.send(result.success(Strings.ENV_CREATED));
  });
}

/**
 * PUT /env/:key (update)
 */
function putEnv(request: Request, response: Response) {
  // Get key from request params
  const { key } = request.params;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.ENV_EMPTY_KEY));
    return;
  }

  // Get value from request body
  const { value } = request.body;

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.ENV_EMPTY_VALUE));
    return;
  }

  // Update env
  Env.update(key, value, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ENV_PUT_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ENV_NOT_FOUND));
      return;
    }

    // Return success
    response.send(result.success(Strings.ENV_UPDATED));
  });
}


/**
 * DELETE /env/:key (delete)
 */
function deleteEnv(request: Request, response: Response) {
  // Get key from request params
  const { key } = request.params;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.ENV_EMPTY_KEY));
    return;
  }

  // Delete env
 Env.delete(key, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.ENV_DELETE_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.ENV_NOT_FOUND));
      return;
    }

    // Return success
    response.send(result.success(Strings.ENV_DELETED));
  });
}

