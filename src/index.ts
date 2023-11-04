import Bun from "bun";

import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { cookie } from "@elysiajs/cookie";

import { setHeader } from "./utils/security";
import type { ElysiaContext, HttpMethod } from "./types";
import routes, { status404, status501 } from "./routes";
import session from "./session";
import Log from "./utils/log";

const app = new Elysia({ name: "UC Main CSPS API" });
const port = 3000;

// Extend logging mechanism to Elysia
Log.extend(app);

// Set security headers
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: process.env.NODE_ENV === 'dev' ? "cross-origin" : "same-origin"
  }
}));

// Set default headers
app.onBeforeHandle((context: ElysiaContext) => {
  setHeader(context, "content-type", "application/json;charset=utf-8");
  setHeader(context, "access-control-allow-origin", process.env.NODE_ENV === 'dev' ? "*" : "https://ucmncsps.org");
  setHeader(context, "access-control-allow-methods", "GET, POST, PUT, DELETE");
  setHeader(context, "x-powered-by", "Bun + Elysia (UC Main CSP-S Server)");
});

// Register session
app.use(session);
app.use(cookie());

// Register routes
for (const route of routes) {
  app.all(route.path, (context: ElysiaContext) => {
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
  Log.s(`✨ New UC Main CSPS API back-end server is running at port ${port}!`);
});
