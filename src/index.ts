import express from "express";
import dotenv from "dotenv";
import { getRouteName, isApiExist } from "./utils/route";
import { handleNotFound, handleUnimplemented } from "./routes/handler";
import { routes } from "./routes";
import Database from "./db/database";
import Student from "./db/models/student";

// Load environment variables from .env file
dotenv.config();

// Create an express app
const app = express();
// Set the port
const port = process.env.PORT || 4000;

// Catch all routes
app.use("*", (request, response) => {
  // Set default response content type
  response.setHeader("Content-Type", "application/json");
  // Get route name
  const routeName = getRouteName(request.originalUrl);

  // If route doesn't exist, return 404
  if (!isApiExist(routeName)) {
    return handleNotFound(request, response);
  }

  // Otherwise, call the route handler
  for (const route of routes) {
    // If the route name matches the path
    if (routeName === route.path) {
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