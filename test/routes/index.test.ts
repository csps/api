import { routes } from "../../src/routes";
import { getMainRoute } from "../../src/utils/route";

/**
 * Testing Express API Routes
 */
describe("Express API Routes", () => {
  test("routes with params should be declared first after their plural endpoints", () => {
    // Previous route
    let prevRoute = '';

    // Loop through all the routes
    for (let i = 0; i < routes.length; i++) {
      // Get main route name
      const route = getMainRoute(routes[i].path);

      // If previous route starts with the current route
      if (prevRoute.startsWith(route)) {
        // If current route has not param
        // and is not the last route
        if (!routes[i].path.includes(":") && i < routes.length - 1) {
          // Expect next route is different
          expect(getMainRoute(routes[i + 1].path).startsWith(route)).toBeFalsy();
        }

        // If current route has param
        // and is not the last route
        if (routes[i].path.includes(":") && i < routes.length - 1) {
          // Expect next route is same as current route
          expect(getMainRoute(routes[i + 1].path).startsWith(route)).toBeTruthy();
        }
      }

      // Set previous route
      prevRoute = route;
    }
  });
});

