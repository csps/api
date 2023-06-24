import { example } from "../core/example";
import { login } from "../core/auth/login";
import { product } from "../core/Services/products";

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
  { path: "/login", methods: ["POST"], handler: login },
  { path: "/product/:id", methods: ["GET"], handler: product},
];