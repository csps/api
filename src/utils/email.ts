import type { EmailMetaData } from "../types";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { readFile } from "fs/promises";
import { join } from "path";

import juice from "juice";
import pug from "pug";
import Log from "./log";
import PriorityQueue from 'p-queue';

// SMTP credentials transporter
let transporter: Transporter;
// Email queue (with concurrency of 10)
const queue = new PriorityQueue({ concurrency: 1 });

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
    ...metadata.data,
    type: metadata.type,
    preheader: metadata.preheader,
    title: metadata.title,
  });

  // Add html to request
  request.html = juice(output);
  
  // Add process to queue
  queue.add(() => new Promise((resolve, reject) => {
    // Log email
    Log.i(`Sending email to <${metadata.to}> (${metadata.subject})`);
    // Send email
    transporter.sendMail(request, async (err, info) => {
      // Call callback (if exists)
      if (typeof callback === "function") {
        callback(err, info);
      }

      // Error
      if (err) {
        Log.e(`Error sending email to <${metadata.to}> (${metadata.subject}): ${err}`);
        return reject(err);
      }

      // Success
      Log.i(`Email sent to <${metadata.to}> (${metadata.subject}). Delaying for 3 seconds...`);
      // Delay for 3 second after sending email
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Log done delay
      Log.i(`Done delaying for 3 seconds!`);
      // Resolve 
      resolve(info);
    });
  }));
}
