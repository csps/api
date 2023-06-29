import { routes } from "../../src/routes";

/**
 * Testing Express API Routes
 */
describe("Express API Routes", () => {
  test("routes with params should be declared first after their plural endpoints", () => {
    // Loop through all the routes except the last one
    for (let i = 0; i < routes.length - 1; i++) {
      // Get the current route
      const route = routes[i];
      // Get the next route
      const nextRoute = routes[i + 1];

      // If the current route has a param
      if (route.path.includes(":")) {
        // Expect the next route to not have a param
        expect(nextRoute.path.includes(":")).toBeFalsy();
        // Expect the next route to start with the current route
        expect(route.path.startsWith(nextRoute.path)).toBeTruthy();
      }
    }
  });
});