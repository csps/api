import dotenv from "dotenv";
import express from "express";
import { getRouteName, getPattern } from "./utils/route";
import { handleNotFound, handleUnimplemented } from "./routes/handler";
import { routes } from "./routes";

// Load environment variables from .env file
dotenv.config();

// Create an express app
const app = express();
// Set the port
const port = process.env.PORT || 4000;

app.use(routes.map(r => r.path), (request, response) => {
  // Set default response content type
  response.setHeader("Content-Type", "application/json");
  // Get route name
  const routeName = getRouteName(request.originalUrl);
  // Get route pattern
  const pattern = getPattern(routeName);

  // If no pattern is found, return 404
  if (pattern === null) {
    return handleNotFound(request, response);
  }

  // Otherwise, call the route handler
  for (const route of routes) {
    // If the route matches the path
    if (pattern === route.path) {
      // If the method is not allowed, return 405
      if (!route.methods.includes(request.method as HttpMethod)) {
        return handleUnimplemented(request, response);
      }

      // Otherwise, call the API handler
      return route.handler(request, response); 
    }
  }
});

app.listen(port, () => {
  console.log(`[+] UC Main CSPS backend API is listening on port ${port}`);
});