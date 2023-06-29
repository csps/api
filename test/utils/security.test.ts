import { sanitize, sanitizeArray } from '../../src/utils/security';

/**
 * Testing Security Utilities
 */
describe("Security Utilities", () => {
  it("should return empty string if value is undefined or null", () => {
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(null)).toBe('');
  });

  it("should convert number or boolean to string", () => {
    expect(sanitize(123)).toBe('123');
    expect(sanitize(true)).toBe('true');
  });

  it("should escape special characters", () => {
    expect(sanitize('Example <string>')).toBe('Example \\<string\\>');
  });

  it("should sanitize each value in the array", () => {
    const values = ['Example <string>', 123, true];
    const sanitizedValues = sanitizeArray(values);

    expect(sanitizedValues[0]).toBe('Example \\<string\\>');
    expect(sanitizedValues[1]).toBe('123');
    expect(sanitizedValues[2]).toBe('true');
  });
});