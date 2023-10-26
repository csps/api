import { ErrorTypes } from "../types/enums";
import Strings from "../config/strings";
import { ElysiaContext, ResponseBody } from "../types";
import response from "../utils/response";

import Env from "../db/models/env";

/**
 * Env API
 * @author mavyfaby (Maverick Fabroa)
 * @param context
 */
function env(context: ElysiaContext): Promise<ResponseBody | undefined> | undefined {
  switch (context.request.method) {
    case "GET":
      return getEnv(context);
    case "POST":
      return postEnv(context);
    case "DELETE":
      return deleteEnv(context);
    case "PUT":
      return putEnv(context);
  }
}

/**
 * GET /env (read)
 */
async function getEnv(context: ElysiaContext) {
  // Get key param
  const { key } = context.params || {};

  // If has a key
  if (key) {
    // Call `getEnvByKey` function instead
    return getEnvByKey(context);
  }

  // Get all env
  try {
    const env = await Env.getAll();
    return response.success(Strings.ENV_FOUND, env);
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ENV_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ENV_NOT_FOUND);
    }
  }
}

/**
 * GET /env/:key (read) 
 */
async function getEnvByKey(context: ElysiaContext) {
  // Get key param
  const { key } = context.params || {};

  // If key is not provided
  if (!key) {
    context.set.status = 400;
    return response.error(Strings.ENV_EMPTY_KEY);
  }

  // Get env value from key
  try {
    const value = await Env.fromKey(key);
    return response.success(Strings.ENV_FOUND, { key, value });
  } catch (err) {
    // If error is DB_ERROR
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ENV_GET_ERROR);
    }

    // If error is DB_EMPTY_RESULT
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ENV_NOT_FOUND);
    }
  }
}

/**
 * POST /env (create)
 */
async function postEnv(context: ElysiaContext) {
  // Get key and value from request body
  const { key, value } = context.body as Record<string, string> || {};

  // If key is empty
  if (!key) {
    context.set.status = 400;
    return response.error(Strings.ENV_EMPTY_KEY);
  }

  // If value is empty
  if (!value) {
    context.set.status = 400;
    return response.error(Strings.ENV_EMPTY_VALUE);
  }

  try {
    // Insert new env
    await Env.insert(key, value);
    // If no error, env is created
    return response.success(Strings.ENV_CREATED, { key, value });
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ENV_POST_ERROR);
    }

    // If already exists
    if (err === ErrorTypes.DB_EXIST) {
      context.set.status = 409;
      return response.error(Strings.ENV_EXISTS);
    }
  }
}

/**
 * PUT /env/:key (update)
 */
async function putEnv(context: ElysiaContext) {
  // Get key from request params
  const { key } = context.params || {};

  // If key is empty
  if (!key) {
    context.set.status = 400;
    return response.error(Strings.ENV_EMPTY_KEY);
  }

  const { value } = context.body as Record<string, string> || {};

  // If value is empty
  if (!value) {
    context.set.status = 400;
    return response.error(Strings.ENV_EMPTY_VALUE);
  }

  try {
    // Update env
    await Env.update(key, value);
    // If no error, env is updated
    return response.success(Strings.ENV_UPDATED, { key, value });
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ENV_PUT_ERROR);
    }

    // If no results
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ENV_NOT_FOUND);
    }
  }
}


/**
 * DELETE /env/:key (delete)
 */
async function deleteEnv(context: ElysiaContext) {
  // Get key from request params
  const { key } = context.params || {};

  // If key is empty
  if (!key) {
    return response.error(Strings.ENV_EMPTY_KEY);
  }

  try {
    // Delete env
    await Env.delete(key);
    // If no error, env is deleted
    return response.success(Strings.ENV_DELETED);
  }

  catch (err) {
    // If database error
    if (err === ErrorTypes.DB_ERROR) {
      context.set.status = 500;
      return response.error(Strings.ENV_DELETE_ERROR);
    }

    // If no results
    if (err === ErrorTypes.DB_EMPTY_RESULT) {
      context.set.status = 404;
      return response.error(Strings.ENV_NOT_FOUND);
    }
  }
}

export default env;