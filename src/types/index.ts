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

  // Error types
  enum ErrorTypes {
    DB_ERROR,
    DB_EMPTY_RESULT,
    DB_STUDENT_ALREADY_EXISTS,
    DB_EMAIL_ALREADY_EXISTS,
    DB_PRODUCT_ALREADY_EXISTS,
  }

  type EmailButton = {
    label: string,
    url: string,
  }
  
  type EmailMetaData = {
    /**
     * Email recipient
     * - Email
     * - Name \<Email\>
     */
    to: string, 
    subject: string,
    message: string,
    title?: string,
    cc?: string[],
    bcc?: string[],
    buttons?: EmailButton[],
    attachments?: File[]
  }

  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string,
      DB_USER: string,
      DB_PASS: string,
      DB_NAME: string,
      SMTP_NAME: string,
      SMTP_HOST: string,
      SMTP_PORT: number,
      SMTP_USER: string,
      SMTP_PASS: string
    }
  }
}