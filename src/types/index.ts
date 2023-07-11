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

  type EmailButton = {
    label: string,
    url: string,
  }
  
  type EmailMetaData = {
    to: string, 
    cc: string[],
    bcc: string[],
    subject: string,
    title: string,
    message: string,
    buttons: EmailButton[],
    attachments: File[]
  }
}