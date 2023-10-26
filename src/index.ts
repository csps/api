import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";

import { ElysiaContext, HttpMethod } from "./types";
import routes, { status404, status501 } from "./routes";
import Log from "./utils/log";

const app = new Elysia();
const port = 3000;

/**
 * Extend logging mechanism to Elysia
 */
Log.extend(app);

/**
 * Set security headers
 */
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: process.env.NODE_ENV === 'development' ?
      "cross-origin" : "same-origin"
  }
}));

/**
 * Set default headers
 */
app.onBeforeHandle((context: ElysiaContext) => {
  context.set.headers["content-type"] = "application/json;charset=utf-8";
});

/**
 * Register routes
 */
for (const route of routes) {
  app.all(route.path, (context: ElysiaContext) => {
    // Check if the route supports the request method
    if (route.methods.includes(context.request.method as HttpMethod)) {
      return route.handler(context);
    }

    // Otherwise, return 501 Not Implemented
    return status501(context);
  });
}

/**
 * Register 404 route
 */
app.all("*", context => {
  return status404(context);
});

/**
 * Start the server
 */
app.listen(port, () => {
  Log.s(`✨ New UC Main CSPS API back-end server is running at port ${port}!`);
});
