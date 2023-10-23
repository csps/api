import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import cors from "cors";

import { getPattern } from "./utils/route";
import { routes } from "./routes";
import { Log } from "./utils/log";
import { checkCredentials } from "./utils/validate";
import { handleNotFound, handleUnimplemented } from "./routes/handler";
import { Session } from "./classes/session";
import { AuthType, ErrorTypes } from "./types/enums";
import { result } from "./utils/response";
import Strings from "./config/strings";
import Database from "./db/database";

// Load environment variables from .env file
dotenv.config();

// Create an express app
const app = express();
// Set the port
const port = process.env.PORT || 3000;

// Configure cors
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : Strings.DOMAIN
}));

// Use helmet for security
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: process.env.NODE_ENV === 'development' ? "cross-origin" : "same-origin"
  }
}));

// Use form url encoded request body
app.use(express.urlencoded({ extended: true }));
// Use file upload plugin
app.use(fileUpload());
// Use custom logger
app.use(Log.getMiddleware());
// Disable caching
app.use(nocache())

/**
 * Handle requests specified in routes
 */
app.use(routes.map(r => r.path), async (request, response) => {
  // Set default response content type
  response.setHeader("Content-Type", "application/json");
  // Get route pattern
  const pattern = getPattern(request.originalUrl);

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

      try {
        // Get session data
        const { id, role, token } = await Session.getSession(request);

        // If not allowed to access the route, nakuha najud :) pwede nako matog
        if (route.auth && route.auth[request.method as HttpMethod] && (role !== route.auth[request.method as HttpMethod] || !role)) {
          response.status(401).send(result.error(Strings.GENERAL_UNAUTHORIZED, "UNAUTHORIZED"));
          return;
        }

        // If has new token is generated
        if (token) {
          // Set authorization header
          response.setHeader("x-" + (role === AuthType.ADMIN ? 'adm' : 'std') + "-authorization", `Bearer ${token}`);
          response.setHeader("Access-Control-Expose-Headers", "x-std-authorization, x-adm-authorization");
        }
        
        // Add ID to response locals
        response.locals.studentID = id;
        // Add role to response locals
        response.locals.role = role;

        // Call the API handler
        return route.handler(request, response); 
      }
      
      catch (e: any) {
        // If has authentication token and is expired
        if (e.type === ErrorTypes.DB_EXPIRED || e.type === ErrorTypes.UNAUTHORIZED) {
          Log.w("A student's session is expired!");
          response.status(401).send(result.error(Strings.GENERAL_UNAUTHORIZED, "UNAUTHORIZED"));
          return;
        }

        // Otherwise, return unknown error
        Log.e(e);
        response.status(500).send(result.error(Strings.GENERAL_SESSION_ERROR, "UNKNOWN"));
      }
    }
  }
});

/**
 * Handle requests that are not specified in the routes
 */
app.use("*", (request, response) => {
  // If requesting for favicon, return image
  if (request.originalUrl.endsWith("/favicon.ico")) {
    return response.sendFile("favicon.ico", { root: "./assets" });
  }

  // Set default response content type
  response.setHeader("Content-Type", "application/json");
  // Otherwise, return 404
  return handleNotFound(request, response);
});

/**
 * Start the server
 */
app.listen(port, () => {
  // Check env credentials
  checkCredentials();
  // Initialize database
  Database.getInstance();
  // Log message
  Log.s(`UC Main CSPS backend API is listening on port ${port}`);
});