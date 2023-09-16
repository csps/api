/**
 * Check if all the required environment variables are set
 */
export function checkCredentials() {
  if (!process.env.DB_HOST) throw new Error("DB_HOST env not set");
  if (!process.env.DB_USER) throw new Error("DB_USER env not set");
  if (!process.env.DB_PASS) throw new Error("DB_PASS env not set");
  if (!process.env.DB_PORT) throw new Error("DB_PORT env not set");
  if (!process.env.DB_NAME) throw new Error("DB_NAME env not set");
  if (!process.env.SMTP_NAME) throw new Error("SMTP_NAME env not set");
  if (!process.env.SMTP_HOST) throw new Error("SMTP_HOST env not set");
  if (!process.env.SMTP_PORT) throw new Error("SMTP_PORT env not set");
  if (!process.env.SMTP_USER) throw new Error("SMTP_USER env not set");
  if (!process.env.SMTP_PASS) throw new Error("SMTP_PASS env not set");
  if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY env not set");
  if (!process.env.ORDERS_UPDATE_ALLOWED_KEYS) throw new Error("ORDERS_UPDATE_ALLOWED_KEYS env not set");
  if (!process.env.STUDENTS_UPDATE_ALLOWED_KEYS) throw new Error("STUDENTS_UPDATE_ALLOWED_KEYS env not set");
}