import type { jwt } from "@elysiajs/jwt";
import { StudentModel } from "../models";
import { EmailType } from "./enums";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";

export type AppRoutes = {
  path: string;
  methods: HttpMethod[];
  handler: (context: ElysiaContext) => void;
  auth?: {
    [key in HttpMethod]?: AuthType;
  }
}

export type ResponseBody = {
  success: boolean;
  message: string;
  data?: any;
  count?: number;
};

export type MariaUpdateResult = {
  insertId: number,
  affectedRows: number,
  warningStatus: number
};

export type ElysiaContext = {
  body: Route['body'];
  query: Record<string, string | null>;
  params: Record<string, string | null>;
  headers: Record<string, string | null>;
  cookie: Record<string, Cookie<any>>;
  set: any;
  path: string;
  request: Request;
  store: {};
  jwt?: any;
  setCookie?: any;
  response?: ResponseBody;
  ip?: {
    address: string;
    family: string;
    port: number;
  },
  user?: StudentModel
};

export type EmailMetaData = {
  type: EmailType,
  to: string, // Name <email@gmail.com>
  subject: string,
  preheader?: string,
  title?: string,
  cc?: string[],
  bcc?: string[],
  data: Record<string, any>
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string,
      DB_USER: string,
      DB_PASS: string,
      DB_NAME: string,
      DB_PORT: string,
      SMTP_NAME: string,
      SMTP_HOST: string,
      SMTP_PORT: number,
      SMTP_USER: string,
      SMTP_PASS: string,
      SECRET_KEY: string,
      ORDERS_UPDATE_ALLOWED_KEYS: string,
      STUDENTS_UPDATE_ALLOWED_KEYS: string,
      API_KEY: string
    }
  }
}
