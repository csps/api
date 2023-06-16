import { routes } from "../routes";

/**
 * Check if the path is an API
 * @param path What path to check
 */
export function isApiExist(path: string) {
  // For each route
  for (const route of routes) {
    // If the path is equal to the route path
    if (path === route.path) {
      // Return true
      return true;
    }
  }

  // Otherwise, false
  return false;
}

/**
 * Get route name from the URL path
 * @param path URL Path
 * @returns the route name
 */
export function getRouteName(route: string) {
  // remove query parameters from the route
  const queryIndex = route.indexOf('?');

  if (queryIndex !== -1) {
    route = route.slice(0, queryIndex);
  }

  // remove trailing slash from the route
  if (route.slice(-1) === '/') {
    route = route.slice(0, -1);
  }

  return route;
}