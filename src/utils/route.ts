import { routes } from "../routes";

/**
 * Get the route pattern from the path
 * @param path What path to check
 */
export function getPattern(requestPath: string) {
  // Path pattern
  const patterns = requestPath.slice(1).split("/");

  // For each route
  for (const route of routes) {
    // If the path is equal to the route path
    if (requestPath === route.path) {
      // Return true
      return requestPath;
    }

    // if contains a colon (:)
    if (route.path.includes(':')) {
      // Request path pattern
      const requestPatterns = route.path.slice(1).split("/");

      // Patterns should be e.g [ 'students , 5 ]
      // Request patterns should be e.g. [ 'students', ':id' ]

      // If the length of the patterns are not equal, continue
      if (patterns.length !== requestPatterns.length) {
        continue;
      }

      // If first pattern is not equal, continue
      if (patterns[0] !== requestPatterns[0]) {
        continue;
      }

      // If the code reached this point, it means that they are matched!
      return route.path;
    }
  }

  // Otherwise, false
  return null;
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