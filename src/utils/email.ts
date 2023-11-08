import type { EmailMetaData } from "../types";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { readFile } from "fs/promises";
import { join } from "path";

import juice from "juice";
import pug from "pug";
import Queue from 'p-queue';

// SMTP credentials transporter
let transporter: Transporter;
// Email queue (with concurrency of 10)
const queue = new Queue({ concurrency: 10 });

/**
 * Send email using Gmail SMTP
 * Callback here is fine, since this isn't need to be awaited
 * @author mavyfaby (Maverick Fabroa)
 * 
 * @param metadata Email metadata
 * @param callback Callback function
 */
export async function sendEmail(metadata: EmailMetaData, callback?: (err: Error | null, info: any) => void) {
  // Main template path
  const path = join(import.meta.dir, "../templates/body.pug");
  // Compile template
  const tpl = pug.compile((await readFile(path)).toString(), { filename: path, cache: true });

  // Create transporter (if not exists)
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

  // Create email request
  const request: SendMailOptions = {
    to: metadata.to,
    subject: metadata.subject,
    text: `${metadata.title}\n\n${metadata.data.message}}`,
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
  };

  // Add CC
  if (metadata.cc && metadata.cc?.length > 0) {
    request.cc = metadata.cc;
  }

  // Add BCC
  if (metadata.bcc && metadata.bcc?.length > 0) {
    request.bcc = metadata.bcc;
  }

  // Delete data (if exists)
  delete metadata.data.type;
  delete metadata.data.title;
  delete metadata.data.preheader;

  // Get email template
  const output = tpl({
    type: metadata.type,
    preheader: metadata.preheader,
    title: metadata.title,
    ...metadata.data
  });

  // Add html to request
  request.html = juice(output);
  
  // Add process to queue
  queue.add(() => new Promise((resolve, reject) => {
    // Send email
    transporter.sendMail(request, (err, info) => {
      if (typeof callback === "function") {
        callback(err, info);
      }

      if (err) {
        return reject(err);
      }

      resolve(info);
    });
  }));

} 
