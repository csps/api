import { example } from "../core/example";
import { login } from "../core/auth/login";
import { product } from "../core/product";
import { products } from "../core/products";
import { student } from "../core/student";
import { event } from "../core/event";
import { events } from "../core/events";
import { students } from "../core/students";


/**
 * This file contains all the routes of the api and the handlers that will be executed.
 * 
 * The structure is as follows:
 * - path: The path of the request
 * - methods: The methods that will be accepted by the path
 * - handler: The function that will be executed when the path is requested
 * 
 * NOTE: Order matters. The first route that matches the path will be executed.
 */
export const routes: AppRoutes[] = [
  // Example
  { path: "/example", methods: ["GET"], handler: example },

  // Login
  { path: "/login", methods: ["POST"], handler: login },

  // Products
  { path: "/products/:id", methods: ["GET"], handler: product },
  { path: "/products", methods: ["GET"], handler: products  },

  // Students
  { path: "/students/:id", methods: ["GET"], handler: student },
  { path: "/students", methods: ["GET"], handler: students },

  // Events
  { path: "/events/:id", methods: ["GET"], handler: event },
  { path: "/events", methods: ["GET"], handler: events },
];