import Bun from "bun";

import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { cookie } from "@elysiajs/cookie";
import { AuthType } from "./types/enums";
import { setHeader } from "./utils/security";
import { jwt, getRole } from "./session";

import type { ElysiaContext, HttpMethod } from "./types";
import routes, { status404, status501 } from "./routes";

import response from "./utils/response";
import Strings from "./config/strings";
import Log from "./utils/log";

const app = new Elysia({ name: "UC Main CSPS API" });
const port = process.env.PORT || 3000;

// Register middlewares
app.use(jwt());
app.use(cookie());
app.use(helmet());

// Extend logging mechanism to Elysia
Log.extend(app);

// Set default headers
app.onBeforeHandle((context: ElysiaContext) => {
  setHeader(context, "content-type", "application/json;charset=utf-8");
  setHeader(context, "x-powered-by", "Bun + Elysia (UC Main CSP-S Server)");
  setHeader(context, "access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  setHeader(context, "access-control-allow-credentials", "true");
  setHeader(context, "access-control-allow-origin", "http://127.0.0.1:3001");
});

// Register routes
for (const route of routes) {
  app.all(route.path, async (context: ElysiaContext) => {
    // Get requested route role
    const routeRole = route.auth ? route.auth[context.request.method as HttpMethod] : null;
    // Get request role
    const requestRole = await getRole(context);

    // Check for route authorization requirements
    if (routeRole !== null && routeRole in [AuthType.STUDENT, AuthType.ADMIN] && requestRole !== routeRole) {
      context.set.status = 401;
      return response.error(Strings.GENERAL_UNAUTHORIZED);
    }

    // Check if the route supports the request HTTP method
    if (route.methods.indexOf(context.request.method as HttpMethod) !== -1) {
      return route.handler(context);
    }

    // Otherwise, return 501 Not Implemented
    return status501(context);
  });
}

// Register 404 route
app.all("*", context => {
  // If looking for favicon
  if (context.path === "/favicon.ico") {
    context.set.headers["content-type"] = "image/x-icon";
    return Bun.file("./assets/favicon.ico");
  }

  return status404(context);
});

// Start the server
app.listen(port, () => {
  Log.s(`✨ New UC Main CSP-S API back-end server is running at port ${port}.`);
  Log.i(`💎 This project was originally created and led by — Maverick Fabroa (A.Y. 2023 - 2024)`);
});
