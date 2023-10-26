import type { AppRoutes, ResponseBody } from "../types";

import example from "../api/example";

const routes: AppRoutes[] = [
  // Example
  { path: "/example", methods: ["GET", "POST", "DELETE", "PUT"], handler: example },
];

export function status404(): ResponseBody {
  return { success: false, message: "The requested resource could not be found." };
}

export function status501(): ResponseBody {
  return { success: false, message: "The requested resource is not implemented." };
}

export default routes;