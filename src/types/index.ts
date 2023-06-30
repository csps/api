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

// Error types
enum ErrorTypes {
  DB_ERROR,
  DB_EMPTY_RESULT,
  DB_STUDENT_ALREADY_EXISTS,
  DB_EMAIL_ALREADY_EXISTS
}

abstract class DatabaseModel {
  static fromId(id: number | string, callback: (error: ErrorTypes | null, product: DatabaseModel | null) => void) {
    throw new Error("Method not implemented.");
  }

  static getAll(callback: (error: ErrorTypes | null, product: DatabaseModel[] | null) => void) {
    throw new Error("Method not implemented.");
  }
}

export {
  ErrorTypes, DatabaseModel
};