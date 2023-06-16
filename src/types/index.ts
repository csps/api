import type { Request, Response } from "express";

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