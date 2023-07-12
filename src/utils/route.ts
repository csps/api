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
      
      // If the first pattern is not equal to the request pattern
      if (patterns[0] !== requestPatterns[0]) {
        // Continue
        continue;
      }

      // For each pattern except the first one
      for (let i = 1; i < patterns.length; i++) {
        // If the pattern is not equal to the request pattern
        if (patterns[i] !== requestPatterns[i] && !requestPatterns[i].includes(':')) {
          // Return null
          return null;
        }
      }

      // If the code reached this point, it means that they are matched!
      return route.path;
    }
  }

  // Otherwise, false
  return null;
}

/**
 * Get the main route name
 * @param path 
 * @returns 
 */
export function getMainRoute(path: string): string {
  // Get the index of the second slash
  const i = path.indexOf("/", 1);
  // Return the main route name
  return path.slice(0, i === -1 ? path.length : i);
}