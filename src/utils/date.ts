/**
 * Get YYYY-MM-DD HH:MM:SS from date
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
 * Check if {time1} is before {time2}
 * @param time1 hh:mm format
 * @param time2 hh:mm format
 */
export function isTimeBefore(time1: string, time2: string) {
  // Get time1 hours and minutes
  const [h1, m1] = time1.split(':').map(x => parseInt(x));

  // Get time2 hours and minutes
  const [h2, m2] = time2.split(':').map(x => parseInt(x));

  // If time1 hours is lesser than time2 hours, return true
  if (h1 < h2) return true;

  // If time1 hours is equal to time2 hours, check minutes
  if (h1 === h2) return m1 < m2;

  // Otherwise, return false
  return false;
}

/**
 * Get YYYY-MM-DD from date
 * @param date Date to get datestamp from
 */
export function getLocalDate(date: Date) {
  // Get year, month, and day
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Return datestamp
  return `${year}-${n(month)}-${n(day)}`;
}

/**
 * Convert date to readable format
 * @param date YYYY-MM-DD HH:MM:SS format
 */
export function getReadableDate(date: string) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const time = dateObj.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true });
  return `${month} ${day}, ${year} at ${time}`;
}

/**
 * Normalize number
 * @param value Number to normalize
 */
function n(value: number) {
  return value < 10 ? '0' + value : value;
}
