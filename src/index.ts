import Bun from "bun";

import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { AuthType } from "./types/enums";
import { setHeader } from "./utils/security";
import { jwt, validateAndGetRole } from "./session";

import type { ElysiaContext, HttpMethod } from "./types";
import routes, { status404, status501 } from "./routes";

import response from "./utils/response";
import Strings from "./config/strings";
import Log from "./utils/log";

const app = new Elysia({ name: "UC Main CSPS API" });
const port = process.env.PORT || 3000;

// Register middlewares
app.use(helmet());
// Extend logging mechanism to Elysia
Log.extend(app);

// Set default headers
app.onBeforeHandle((context: ElysiaContext) => {
  setHeader(context, "content-type", "application/json;charset=utf-8");
  setHeader(context, "x-powered-by", "Bun + Elysia (UC Main CSP-S Server)");
  setHeader(context, "access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  setHeader(context, "access-control-allow-headers", "Origin, Content-Type, Authorization");
  setHeader(context, "access-control-expose-headers", "Authorization");
  setHeader(context, "access-control-allow-credentials", "true");
  setHeader(context, "access-control-allow-origin", "http://127.0.0.1:4000");
});

// Register routes
for (const route of routes) {
  app.all(route.path, async (context: ElysiaContext) => {
    // If preflight request, return 200 OK
    if (context.request.method === "OPTIONS") {
      return context.set.status = 200;
    }

    // Get request role
    const requestRole = await validateAndGetRole(context);
    // Get requested route role
    const routeRole: AuthType | AuthType[] | undefined = route.auth ?
      route.auth[context.request.method as HttpMethod] : undefined;

    // If requestRole is false, meaning the token is expired
    if (requestRole === false) {
      context.set.status = 401;
      return response.error(Strings.GENERAL_SESSION_EXPIRED);
    }

    if (!requestRole && routeRole) {
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
