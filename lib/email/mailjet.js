/**
 * Mailjet Email Service
 * Centralized email sending functionality using Mailjet
 */
import Mailjet from "node-mailjet";

// Initialize Mailjet client
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

/**
 * Send an email using Mailjet
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.toName - Recipient name (optional)
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 * @param {string} options.replyTo - Reply-to email address (optional)
 * @returns {Promise<Object>} - Mailjet response
 */
export async function sendEmail({
  to,
  toName = "",
  subject,
  text,
  html,
  replyTo,
}) {
  const fromEmail = process.env.MAILJET_FROM_EMAIL || "noreply@subzy.nl";
  const fromName = process.env.MAILJET_FROM_NAME || "Subzy";

  const message = {
    From: {
      Email: fromEmail,
      Name: fromName,
    },
    To: [
      {
        Email: to,
        Name: toName,
      },
    ],
    Subject: subject,
    TextPart: text,
  };

  // Add HTML if provided
  if (html) {
    message.HTMLPart = html;
  }

  // Add reply-to if provided
  if (replyTo) {
    message.ReplyTo = {
      Email: replyTo,
    };
  }

  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [message],
    });

    return {
      success: true,
      data: response.body,
    };
  } catch (error) {
    console.error("Mailjet error:", error.statusCode, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send email to multiple recipients
 * @param {Array<{email: string, name?: string}>} recipients - Array of recipients
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content (optional)
 * @returns {Promise<Object>} - Mailjet response
 */
export async function sendBulkEmail(recipients, subject, text, html) {
  const fromEmail = process.env.MAILJET_FROM_EMAIL || "noreply@subzy.nl";
  const fromName = process.env.MAILJET_FROM_NAME || "Subzy";

  const messages = recipients.map((recipient) => ({
    From: {
      Email: fromEmail,
      Name: fromName,
    },
    To: [
      {
        Email: recipient.email,
        Name: recipient.name || "",
      },
    ],
    Subject: subject,
    TextPart: text,
    ...(html && { HTMLPart: html }),
  }));

  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: messages,
    });

    return {
      success: true,
      data: response.body,
    };
  } catch (error) {
    console.error("Mailjet bulk error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
