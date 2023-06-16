import { example } from "../core/example";

/**
 * This file contains all the routes of the api and the handlers that will be executed.
 * 
 * The structure is as follows:
 * - path: The path of the request
 * - methods: The methods that will be accepted by the path
 * - handler: The function that will be executed when the path is requested
 */
export const routes: AppRoutes[] = [
  { path: "/example", methods: ["GET"], handler: example },
];