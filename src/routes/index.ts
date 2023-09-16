import {
  example, login, products, students,
  events, tutorials, photos, orders,
  forgotPassword, resetPassword,
  env, courses, announcements,
  admin_login, qrcode
} from "../core"

  import { AuthType } from "../types/enums";

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

  // Env
  { path: "/env/:key", methods: ["GET", "PUT", "DELETE"], handler: env, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN }},
  { path: "/env", methods: ["GET", "POST"], handler: env, auth: { "POST": AuthType.ADMIN }},

  // Courses
  { path: "/courses/:id", methods: ["PUT", "DELETE"], handler: courses, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN } },
  { path: "/courses", methods: ["GET", "POST"], handler: courses, auth: { "POST": AuthType.ADMIN }},
  
  // Forgot password
  { path: "/forgot-password", methods: ["POST"], handler: forgotPassword },
  
  // Reset password
  { path: "/reset-password/:token", methods: ["GET"], handler: resetPassword },
  { path: "/reset-password", methods: ["POST"], handler: resetPassword },
  
  // Products
  { path: "/products/:id", methods: ["GET", "PUT"], handler: products },
  { path: "/products", methods: ["GET", "POST"], handler: products, auth: { "POST": AuthType.ADMIN }},

  // Admin Login
  { path: "/admins/login/:token", methods: ["GET"], handler: admin_login },
  { path: "/admins/login", methods: ["POST"], handler: admin_login },

  // Students Login
  { path: "/students/login/:token", methods: ["GET"], handler: login },
  { path: "/students/login", methods: ["POST"], handler: login },

  // Students
  { path: "/students/:id/uid/:key", methods: ["PUT"], handler: students, auth: { "PUT": AuthType.ADMIN }},
  { path: "/students/:id/id/:key", methods: ["PUT"], handler: students, auth: { "PUT": AuthType.ADMIN }},
  { path: "/students/:id/uid", methods: ["GET"], handler: students, auth: { "GET": AuthType.ADMIN }},
  { path: "/students/:id/id", methods: ["GET"], handler: students, auth: { "GET": AuthType.ADMIN }},
  { path: "/students/:key", methods: ["PUT"], handler: students, auth: { "PUT": AuthType.STUDENT }},
  { path: "/students", methods: ["GET", "POST"], handler: students, auth: { "POST": AuthType.ADMIN }},

  // Events
  { path: "/events/:id", methods: ["GET"], handler: events },
  { path: "/events", methods: ["GET", "POST"], handler: events, auth: { "POST": AuthType.ADMIN }},

  // Tutorials
  { path: "/tutorials/:year/year", methods: ["GET"], handler: tutorials },
  { path: "/tutorials/:id/id", methods: ["GET"], handler: tutorials },
  { path: "/tutorials", methods: ["GET", "POST"], handler: tutorials, auth: { "POST": AuthType.ADMIN }},

  // Photos
  { path: "/photos/:id/receipt/raw", methods: ["GET"], handler: photos },
  { path: "/photos/:id/receipt", methods: ["GET"], handler: photos },
  { path: "/photos/:id/raw", methods: ["GET"], handler: photos },
  { path: "/photos/:id", methods: ["GET"], handler: photos },
  { path: "/photos", methods: ["POST"], handler: photos, auth: { "POST": AuthType.ADMIN }},

  // Orders
  { path: "/orders/receipt/:receipt/student/:studentId", methods: ["GET"], handler: orders, auth: { "GET": AuthType.ADMIN }},
  { path: "/orders/receipt/:receipt", methods: ["GET"], handler: orders },
  { path: "/orders/:id/:key", methods: ["PUT"], handler: orders, auth: { "PUT": AuthType.ADMIN }},
  { path: "/orders/:id", methods: ["GET"], handler: orders },
  { path: "/orders", methods: ["GET", "POST"], handler: orders },

  // QR Code
  { path: "/qrcode/:q/dark" , methods: ['GET'], handler: qrcode },
  { path: "/qrcode/:q" , methods: ['GET'], handler: qrcode },
 
  // Announcements
  { path: "/announcements/:academic_year", methods: ["GET"], handler: announcements },
  { path: "/announcements/:id", methods: ["PUT"], handler: announcements, auth: { "PUT": AuthType.ADMIN }},
  { path: "/announcements", methods: ["GET","POST"], handler: announcements, auth: { "POST": AuthType.STUDENT }}
];