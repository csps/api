import { isDate, isEmail } from "../../src/utils/string";

/**
 * String utilities test
 */
describe("String Utilities", () => {
  it("should validate if a string is valid email address", () => {
    // List of test cases
    const emails = [
      { email: "john.doe@example.com", expected: true },
      { email: "jane_smith123@gmail.com", expected: true },
      { email: "alice-87@yahoo.co.uk", expected: true },
      { email: "peter_wong@mydomain.com", expected: true },
      { email: "sarah.miller@example.org", expected: true },
      { email: "john.doe@example", expected: false },
      { email: "jane_smith123@gmail", expected: false },
      { email: "alice-87@yahoo", expected: false },
      { email: "peter_wong@mydomain", expected: false },
      { email: "sarah.miller@example", expected: false },
      { email: "david_brown45@hotmail.com", expected: true },
      { email: "emma.wilson@example.net", expected: true },
      { email: "robert_smith@my-domain.com", expected: true },
      { email: "anna.jones@co.uk", expected: true },
      { email: "mark123@gmail.com", expected: true },
      { email: "david_brown45@hotmail", expected: false },
      { email: "emma.wilson@example", expected: false },
      { email: "robert_smith@my-domain", expected: false },
      { email: "anna.jones@co", expected: false },
      { email: "mark123@gmail", expected: false }
    ];

    // Loop through all the test cases
    for (const email of emails) {
      // Expect the email to be valid
      expect(isEmail(email.email)).toBe(email.expected);
    }
  });

  it("should validate if a date is valid", () => {
    // List of dates
    const dates = [
      { date: "2022-01-15", valid: true },
      { date: "2023-02-28", valid: true },
      { date: "2024-03-31", valid: true },
      { date: "2025-04-30", valid: true },
      { date: "2026-05-31", valid: true },
      { date: "2027-06-30", valid: true },
      { date: "2028-07-31", valid: true },
      { date: "2029-08-31", valid: true },
      { date: "2030-09-30", valid: true },
      { date: "2031-10-31", valid: true },
      { date: "2032-11-30", valid: true },
      { date: "2033-12-31", valid: true },
      { date: "2022-02-30", valid: false },
      { date: "2023-13-01", valid: false },
      { date: "2024-04-31", valid: false },
      { date: "2025-06-31", valid: false },
      { date: "2026-09-31", valid: false },
      { date: "2027-11-31", valid: false },
      { date: "2028-02-29", valid: false },
      { date: "2029-11-31", valid: false }
    ];
    
    // Loop through all the dates
    for (const date of dates) {
      // Expect the date to be valid
      expect(isDate(date.date)).toBe(date.valid);
    }
  });
});