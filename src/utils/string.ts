/**
 * Check if a string is a number
 * @param value value to check
 */
export function isNumber(value: any): boolean {
  return /^\d*\.?\d+$/.test(value)
}

/**
 * Check if a string is an email address
 * @param value String to check
 */
export function isEmail(value: string):  boolean {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
}

/**
 * Trim all values in an object
 * @param value object to trim
 */
export function trim(value: Record<string, any>) {
  const keys = Object.keys(value);

  for (const key of keys) {
    if (typeof value[key] === "string") {
      value[key] = value[key].trim();
    }
  }
}

/**
 * Check if object is empty
 * @param object object to check
 */
export function isObjectEmpty(object: any) {
  if (typeof object !== "object") return true;
  return Object.keys(object).length === 0;
}