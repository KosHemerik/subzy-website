/**
 * Email Service - Main Export
 * Central entry point for all email functionality
 */
export { sendEmail, sendBulkEmail } from "./mailjet";
export * from "./templates";

import { sendEmail } from "./mailjet";
import {
  contactFormAdminTemplate,
  contactFormConfirmationTemplate,
  intakeFormAdminTemplate,
} from "./templates";

/**
 * Send contact form emails (to admin + confirmation to sender)
 * @param {Object} formData - Contact form data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendContactFormEmails(formData) {
  const adminEmail = process.env.ADMIN_EMAIL || "info@subzy.nl";
  const { naam, email, onderwerp } = formData;

  // Generate templates
  const adminTemplate = contactFormAdminTemplate(formData);
  const confirmationTemplate = contactFormConfirmationTemplate(formData);

  const onderwerpLabels = {
    energiebelasting: "Teruggave Energiebelasting",
    subsidie: "Duurzaamheidssubsidie",
    lopende_aanvraag: "Lopende aanvraag",
    klantportaal: "Probleem met Klantportaal",
    anders: "Anders",
  };

  try {
    // Send notification to admin
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `Nieuw contactbericht: ${onderwerpLabels[onderwerp] || onderwerp}`,
      text: adminTemplate.text,
      html: adminTemplate.html,
      replyTo: email,
    });

    if (!adminResult.success) {
      console.error("Failed to send admin notification:", adminResult.error);
      return { success: false, error: "Failed to send notification" };
    }

    // Send confirmation to sender
    const confirmResult = await sendEmail({
      to: email,
      toName: naam,
      subject: "Bedankt voor uw bericht - Subzy",
      text: confirmationTemplate.text,
      html: confirmationTemplate.html,
    });

    if (!confirmResult.success) {
      console.error("Failed to send confirmation:", confirmResult.error);
      // Don't fail the whole operation if confirmation fails
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send intake form notification
 * @param {Object} formData - Intake form data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendIntakeNotification(formData) {
  const adminEmail = process.env.ADMIN_EMAIL || "info@subzy.nl";
  const template = intakeFormAdminTemplate(formData);

  try {
    const result = await sendEmail({
      to: adminEmail,
      subject: `Nieuwe intake aanvraag: ${formData.type === "energie" ? "Energiebelasting" : "Duurzaamheid"}`,
      text: template.text,
      html: template.html,
      replyTo: formData.email,
    });

    return result;
  } catch (error) {
    console.error("Intake notification error:", error);
    return { success: false, error: error.message };
  }
}
