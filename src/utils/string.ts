/**
 * Check if a string is a number
 * @param value String to check
 */
export function isNumber(value: string): boolean {
  return /^\d+$/.test(value)
}