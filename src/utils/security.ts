/**
 * Sanitize a value
 * @param value Value to sanitize
 */
function sanitize(value: any): string {
  // if undefined or null, return empty string
  if (value === undefined || value === null) {
    return '';
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