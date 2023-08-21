/**
 * This is an example of a structure for a mnemonic and clear api functions.
 * @author mavyfaby (Maverick Fabroa)
 */

import type { Request, Response } from "express";
import { result } from "../utils/response";
import { Config } from "../db/models/config";
import { ErrorTypes } from "../types/enums";
import Strings from "../config/strings";

/**
 * Config API
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param request Express Request Object
 * @param response Express Response Object
 */
export function config(request: Request, response: Response) {
  switch (request.method) {
    case "GET":
      getConfig(request, response);
      break;
    case "POST":
      postConfig(request, response);
      break;
    case "DELETE":
      deleteConfig(request, response);
      break;
    case "PUT":
      putConfig(request, response);
      break;
  }
}

/**
 * GET /config (read)
 */
function getConfig(request: Request, response: Response) {
  // Getting params 
  const { key } = request.params;

  // If has a key
  if (key) {
    // Call `getConfigByKey` function instead
    getConfigByKey(request, response);
    return;
  }

  // Get all configs
  Config.getAll((error, config) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.CONFIG_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.CONFIG_NOT_FOUND));
      return;
    }

    // Return the config
    response.send(result.success(Strings.CONFIG_FOUND, config));
  });
}

/**
 * GET /config/:key (read) 
 */
function getConfigByKey(request: Request, response: Response) {
  // Getting params 
  const { key } = request.params;

  // If has no key
  if (!key) {
    response.status(400).send(result.error("Key is required!"));
    return;
  }

  // Get config by key
  Config.fromKey(key, (error, value) => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.CONFIG_GET_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.CONFIG_NOT_FOUND));
      return;
    }

    // Return the value
    response.send(result.success(Strings.CONFIG_FOUND, value));
  });
}

/**
 * POST /config (create)
 */
function postConfig(request: Request, response: Response) {
  // Get key and value from request body
  const { key, value } = request.body;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.CONFIG_EMPTY_KEY));
    return;
  }

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.CONFIG_EMPTY_VALUE));
    return;
  }

  // Insert config
  Config.insert(key, value, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.CONFIG_POST_ERROR));
      return;
    }

    // If already exists
    if (error === ErrorTypes.DB_EXIST) {
      response.status(400).send(result.error(Strings.CONFIG_EXISTS));
      return;
    }

    // Return success
    response.send(result.success(Strings.CONFIG_CREATED));
  });
}

/**
 * PUT /config/:key (update)
 */
function putConfig(request: Request, response: Response) {
  // Get key from request params
  const { key } = request.params;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.CONFIG_EMPTY_KEY));
    return;
  }

  // Get value from request body
  const { value } = request.body;

  // If value is empty
  if (!value) {
    response.status(400).send(result.error(Strings.CONFIG_EMPTY_VALUE));
    return;
  }

  // Update config
  Config.update(key, value, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.CONFIG_PUT_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.CONFIG_NOT_FOUND));
      return;
    }

    // Return success
    response.send(result.success(Strings.CONFIG_UPDATED));
  });
}


/**
 * DELETE /config/:key (delete)
 */
function deleteConfig(request: Request, response: Response) {
  // Get key from request params
  const { key } = request.params;

  // If key is empty
  if (!key) {
    response.status(400).send(result.error(Strings.CONFIG_EMPTY_KEY));
    return;
  }

  // Delete config
  Config.delete(key, error => {
    // If database error
    if (error === ErrorTypes.DB_ERROR) {
      response.status(500).send(result.error(Strings.CONFIG_DELETE_ERROR));
      return;
    }

    // If no results
    if (error === ErrorTypes.DB_EMPTY_RESULT) {
      response.status(404).send(result.error(Strings.CONFIG_NOT_FOUND));
      return;
    }

    // Return success
    response.send(result.success(Strings.CONFIG_DELETED));
  });
}

