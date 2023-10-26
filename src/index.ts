import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";

import { ElysiaContext, HttpMethod } from "./types";
import routes, { status404, status501 } from "./routes";

const app = new Elysia();
const port = 3000;

// Register helmet middleware
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: process.env.NODE_ENV === 'development' ?
      "cross-origin" : "same-origin"
  }
}));

// Register routes
for (const route of routes) {
  app.all(route.path, (context: ElysiaContext) => {
    // Check if the route supports the request method
    if (route.methods.includes(context.request.method as HttpMethod)) {
      return route.handler(context);
    }

    // Otherwise, return 501 Not Implemented
    return status501();
  });
}

// Handle 404 Not Found
app.all("*", status404);

// Start the server
app.listen(port, () => {
  console.log(`✨ New UC Main CSPS API back-end server is running at port ${port}!`);
});
