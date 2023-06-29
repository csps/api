import { getPattern } from '../../src/utils/route';

/**
 * Testing Route Utilities
 */
describe("Route Utilities", () => {
  it("should return the pattern from request URL", () => {
    expect(getPattern("/students/10")).toBe("/students/:id");
  })

  it("should return null when pattern doesn't exist", () => {
    expect(getPattern("/example/10")).toBe(null);
  });
});