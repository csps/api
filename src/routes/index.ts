import {
  example, login, products, students,
  events, tutorials, photos, orders
} from "../core"

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
  { path: "/products/:id", methods: ["GET"], handler: products },
  { path: "/products", methods: ["GET", "POST"], handler: products  },

  // Students
  { path: "/students/:uid/uid", methods: ["GET"], handler: students },
  { path: "/students/:id/id", methods: ["GET"], handler: students },
  { path: "/students", methods: ["GET", "POST"], handler: students },

  // Events
  { path: "/events/:id", methods: ["GET"], handler: events },
  { path: "/events", methods: ["GET", "POST"], handler: events },

  // Tutorials
  { path: "/tutorials/:year/year", methods: ["GET"], handler: tutorials },
  { path: "/tutorials/:id/id", methods: ["GET"], handler: tutorials },
  { path: "/tutorials", methods: ["GET", "POST"], handler: tutorials },

  // Photos
  { path: "/photos/:id/raw", methods: ["GET"], handler: photos },
  { path: "/photos/:id", methods: ["GET"], handler: photos },
  { path: "/photos", methods: ["POST"], handler: photos },

  // Orders
  { path: "/orders/all", methods: ["GET"], handler: orders },
  { path: "/orders/:id/:key", methods: ["PUT"], handler: orders },
  { path: "/orders/:id", methods: ["GET"], handler: orders },
  { path: "/orders", methods: ["GET", "POST"], handler: orders }
];