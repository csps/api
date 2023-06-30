/**
 * Get datestamp from date
 * @param date Date to get datestamp from
 */
export function getDatestamp(date?: Date) {
  // If date is not defined, use current date
  if (!date) date = new Date();

  // Get year, month, and day
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Get hours, minutes, and seconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Return datestamp
  return `${year}-${n(month)}-${n(day)} ${n(hours)}:${n(minutes)}:${n(seconds)}`;
}

/**
 * Normalize number
 * @param value Number to normalize
 */
function n(value: number) {
  return value < 10 ? '0' + value : value;
}