import {
  example, login, products, students,
  events, tutorials, photos, orders,
  forgotPassword, resetPassword,
  config, courses, announcements
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

  // Config
  { path: "/config/:key", methods: ["GET", "PUT", "DELETE"], handler: config },
  { path: "/config", methods: ["GET", "POST"], handler: config },

  // Courses
  { path: "/courses/:id", methods: ["PUT", "DELETE"], handler: courses },
  { path: "/courses", methods: ["GET", "POST"], handler: courses },

  // Login
  { path: "/login/:token", methods: ["GET"], handler: login },
  { path: "/login", methods: ["POST"], handler: login },

  // Forgot password
  { path: "/forgot-password", methods: ["POST"], handler: forgotPassword },

  // Reset password
  { path: "/reset-password/:token", methods: ["GET"], handler: resetPassword },
  { path: "/reset-password", methods: ["POST"], handler: resetPassword },

  // Products
  { path: "/products/:id", methods: ["GET"], handler: products },
  { path: "/products", methods: ["GET", "POST"], handler: products  },

  // Students
  { path: "/students/:id/uid/:key", methods: ["PUT"], handler: students },
  { path: "/students/:id/id/:key", methods: ["PUT"], handler: students },
  { path: "/students/:id/uid", methods: ["GET"], handler: students },
  { path: "/students/:id/id", methods: ["GET"], handler: students },
  { path: "/students/:key", methods: ["PUT"], handler: students },
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
  { path: "/orders/:id/:key", methods: ["PUT"], handler: orders },
  { path: "/orders/:id", methods: ["GET"], handler: orders },
  { path: "/orders", methods: ["GET", "POST"], handler: orders },

  // Announcements
  { path: "/announcements/:academic_year", methods: ["GET", "DELETE"], handler: announcements },
  { path: "/announcements/:id", methods: ["PUT"], handler: announcements },
  { path: "/announcements", methods: ["GET","POST"], handler: announcements },
];