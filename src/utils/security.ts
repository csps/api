import { randomBytes } from "crypto";

/**
 * Sanitize a value
 * @param value Value to sanitize
 */
export function sanitize(value: any): any {
  // If null, just return null
  if (value === null) return null;
  // if undefined, return empty string
  if (value === undefined) return '';

  // If buffer, return as is
  if (Buffer.isBuffer(value)) {
    return value;
  }

  // If number or boolean, convert to string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }

  // List of special characters to be escaped
  const specialChars = [
    '\\', // backslash
    '\'', // single quote
    '"', // double quote
    '\`', // backtick
    '<', // less than
    '>', // greater than
    '&', // ampersand
    ';', // semicolon
    '$', // dollar sign
    '{', // opening curly brace
    '}', // closing curly brace
    '(', // opening parenthesis
    ')' // closing parenthesis
  ];

  // Escape each special character
  specialChars.forEach(char => {
    const regex = new RegExp(`\\${char}`, 'g');
    value = value.replace(regex, `\\${char}`);
  });

  // Return the sanitized value
  return value;
}

/**
 * Sanitize an array of values
 * @param values Array of values to sanitize
 */
export function sanitizeArray(values: any[]): string[] {
  // Sanitize each value
  return values.map(value => sanitize(value));
}

/**
 * Generate secure token
 */
export function generateToken(length = 16) {
  return randomBytes(Math.floor(length / 2)).toString('hex');
}