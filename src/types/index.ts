import type { Request, Response } from "express";
import { AuthType } from "./enums";

declare global {
  // Allowed HTTP methods
  type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

  type AppRoutes = {
    path: string;
    methods: HttpMethod[];
    handler: (request: Request, response: Response) => void;
    auth?: {
      [key in HttpMethod]?: AuthType;
    }
  }

  type SessionData = {
    id: string,
    role?: AuthType,
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
    button?: EmailButton,
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
      SMTP_PASS: string,
      SECRET_KEY: string,
      ORDERS_UPDATE_ALLOWED_KEYS: string,
      STUDENTS_UPDATE_ALLOWED_KEYS: string,
    }
  }

  namespace Express {
    interface Locals {
      studentID?: string
    }
  }
}