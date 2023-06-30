// Months with 31 days
const months31 = [1, 3, 5, 7, 8, 10, 12];
// Months with 30 days
const months30 = [4, 6, 9, 11];
// Months with 28 days
const months28 = [2];

/**
 * Check if a string is a number
 * @param value String to check
 */
export function isNumber(value: string): boolean {
  return /^\d+$/.test(value)
}

/**
 * Check if a string is an email address
 * @param value String to check
 */
export function isEmail(value: string):  boolean {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}

/**
 * Check if a string is in YYYY-MM-DD format
 * @param value Date string to check
 */
export function isDate(value: string): boolean {
  // Trim the string
  value = value.trim();

  // If length is not 10, return false
  if (value.length !== 10) return false;
  // If format is not YYYY-MM-DD, return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  // Split the date string
  const parts = value.split('-');

  // Get year, month, and day
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  // If year is not a number, return false
  if (isNaN(year)) return false;
  // If month is not a number, return false
  if (isNaN(month)) return false;
  // If day is not a number, return false
  if (isNaN(day)) return false;

  // If month is less than 1 or greater than 12, return false
  if (month < 1 || month > 12) return false;
  // If day is less than 1 or greater than depending on which month, return false
  if (day < 1 ||
    (months31.includes(month) && day > 31) ||
    (months30.includes(month) && day > 30) ||
    (months28.includes(month) && day > 28)
  ) return false;

 // Otherwise, return true
  return true; 
}