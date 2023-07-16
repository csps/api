import { createTransport, SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Send email using SMTP
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param metadata Email metadata
 * @param callback Callback function
 */
export function sendEmail(metadata: EmailMetaData, callback: (error: Error | null, info: SMTPTransport.SentMessageInfo) =>  void) {
  // Create transporter from SMTP credentials 
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Create data
  const data: SendMailOptions = {
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
    subject: metadata.subject,
    text: metadata.message,
    to: metadata.to,
  };

  // Add CC
  if (metadata.cc && metadata.cc?.length > 0) {
    data.cc = metadata.cc;
  }

  // Add BCC
  if (metadata.bcc && metadata.bcc?.length > 0) {
    data.bcc = metadata.bcc;
  }

  // Send email
  transporter.sendMail(data, callback);
}