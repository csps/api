import type { AppRoutes, ElysiaContext, ResponseBody } from "../types";
import { AuthType } from "../types/enums";

import announcements from "../api/announcements";
import example from "../api/example";
import courses from "../api/courses";
import events from "../api/events";
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

  // Announcements
  { path: "/announcements/:id", methods: ["PUT", "DELETE"], handler: announcements, auth: { "PUT": AuthType.ADMIN, "DELETE": AuthType.ADMIN }},
  { path: "/announcements", methods: ["GET","POST"], handler: announcements, auth: { "POST": AuthType.STUDENT }},

  // Events
  { path: "/events/next", methods: ["GET"], handler: events },
  { path: "/events/:id", methods: ["PUT", "DELETE"], handler: events },
  { path: "/events", methods: ["GET", "POST"], handler: events, auth: { "POST": AuthType.ADMIN }},
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