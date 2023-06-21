import type { Request, Response } from "express";
import ErrorTypes from "./errors";

declare global {
  // Allowed HTTP methods
  type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

  // Structure of the routes
  type AppRoutes = {
    path: string;
    methods: HttpMethod[];
    handler: (request: Request, response: Response) => void;
  }
}

export {
  ErrorTypes
};