export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type AppRoutes = {
  path: string;
  methods: HttpMethod[];
  handler: (data: ElysiaRequest) => void;
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

export type ElysiaRequest = {
  body: unknown;
  query: Record<string, string | null>;
  params: never;
  headers: Record<string, string | null>;
  cookie: Record<string, Cookie<any>>;
  set: {};
  path: string;
  request: Request;
  store: {};
};