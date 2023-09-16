import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import Handlebars from "handlebars";

import { readFile } from "fs";
import { resolve } from "path";
import { Log } from "./log";

// Create transporter from SMTP credentials
let transporter: Transporter;
let compiledTemplate: Handlebars.TemplateDelegate;

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
      Log.e(error.message);
      callback(error, null);
      return;
    }

    // Set compiled template if not yet set
    if (!compiledTemplate) {
      compiledTemplate = Handlebars.compile(template);
    }

    // If year is not set, set it to current year
    if (!metadata.year) {
      metadata.year = new Date().getFullYear();
    }

    // Replace \n with <br>
    metadata.message = metadata.message.replace(/\n/g, "<br>") || "";
    // Render template
    template = compiledTemplate(metadata);

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