import { StudentModel } from "../models";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

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
  params: never;
  headers: Record<string, string | null>;
  cookie: Record<string, Cookie<any>>;
  set: any;
  path: string;
  request: Request;
  store: {};
  response?: ResponseBody;
  ip?: {
    address: string;
    family: string;
    port: number;
  },
  user?: StudentModel
};