import type { AppRoutes, ElysiaContext, ResponseBody } from "../types";
import { AuthType } from "../types/enums";

import announcements from "../api/announcements";
import example from "../api/example";
import courses from "../api/courses";
import products from "../api/products";
import students from "../api/students";
import photos from "../api/photos";
import events from "../api/events";
import forgot from "../api/forgot";
import orders from "../api/orders";
import login from "../api/login";
import reset from "../api/reset";
import env from "../api/env";

const routes: AppRoutes[] = [
  // Example
  { path: "/example", methods: ["GET", "POST", "DELETE", "PUT"], handler: example },

  // Env
  { path: "/env/:key", methods: ["GET", "PUT", "DELETE"], handler: env, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN }},
  { path: "/env", methods: ["GET", "POST"], handler: env, auth: { "POST": AuthType.ADMIN }},

  // Courses
  { path: "/courses/:id", methods: ["PUT", "DELETE"], handler: courses, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN } },
  { path: "/courses", methods: ["GET", "POST"], handler: courses, auth: { "POST": AuthType.ADMIN }},

  // Forgot password
  { path: "/forgot", methods: ["POST"], handler: forgot },

  // Announcements
  { path: "/announcements/:id", methods: ["PUT", "DELETE", "OPTIONS"], handler: announcements, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN }},
  { path: "/announcements", methods: ["GET","POST"], handler: announcements, auth: { "POST": AuthType.ADMIN }},

  // Events
  { path: "/events/next", methods: ["GET"], handler: events },
  { path: "/events/:id", methods: ["PUT", "DELETE"], handler: events },
  { path: "/events", methods: ["GET", "POST"], handler: events, auth: { "POST": AuthType.ADMIN }},

  // Students
  { path: "/students/:student_id", methods: ["PUT"], handler: students, auth: { "POST": AuthType.ADMIN }},
  { path: "/students", methods: ["GET", "POST"], handler: students, auth: { "POST": AuthType.ADMIN }},

  // Login
  { path: "/login", methods: ["GET", "POST", "OPTIONS"], handler: login },

  // Photos
  { path: "/photos/:hash", methods: ["GET"], handler: photos },
  { path: "/photos", methods: ["POST"], handler: photos },

  // Products
  { path: "/products/:slug", methods: ["GET"], handler: products },
  { path: "/products", methods: ["GET"], handler: products },

  // Reset password
  { path: "/reset/:token", methods: ["GET"], handler: reset },
  { path: "/reset/", methods: ["POST"], handler: reset },

  // Orders
  { path: "/orders", methods: ["GET", "POST"], handler: orders },
];

export function status404(context: ElysiaContext): ResponseBody {
  context.set.status = 404;
  return { success: false, message: "The requested resource could not be found." };
}

export function status501(context: ElysiaContext): ResponseBody {
  context.set.status = 501;
  return { success: false, message: "The requested resource is not implemented." };
}

export default routes;