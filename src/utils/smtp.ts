import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { readFile } from "fs";
import { resolve } from "path";

// Create transporter from SMTP credentials
let transporter: Transporter;

/**
 * Send email using SMTP
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param metadata Email metadata
 * @param callback Callback function
 */
export function sendEmail(metadata: EmailMetaData, callback: (error: Error | null, info: SMTPTransport.SentMessageInfo | null) =>  void) {
  // If transporter is not yet created, create one
  if (!transporter) {
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Get template
  readFile(resolve("./src/templates/email.handlebars"), "utf8", (error, template) => {
    if (error) {
      console.log(error);
      callback(error, null);
      return;
    }
    
    // If button is present, replace placeholders
    if (metadata.button) {
      template = template.replace("display: none;", "display: block;");
      template = template.replace("{url}", metadata.button?.url || "");
      template = template.replace("{button_name}", metadata.button?.label || "");

      // Append link to message
      metadata.message += `\n\n${metadata.button.url}`;
    }

    // Replace placeholders
    template = template.replace("{title}", metadata.title || "");
    template = template.replace("{message}", metadata.message.replace(/\n/g, "<br>") || "");
    template = template.replace("{year}", new Date().getFullYear().toString());

    // Create data
    const data: SendMailOptions = {
      from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
      subject: metadata.subject,
      text: metadata.message,
      html: template,
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
  });
}