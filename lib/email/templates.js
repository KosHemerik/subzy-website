/**
 * Email Templates
 * Reusable email templates for different purposes
 */
import { COMPANY_INFO } from "@/lib/constants";

/**
 * Base HTML wrapper for all emails
 */
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; background: #ffffff; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background: #4c7fd1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .info-box { background: #f0f7ff; border-left: 4px solid #4c7fd1; padding: 15px; margin: 20px 0; }
    h2 { color: #1e3a5f; }
    .divider { border-top: 1px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subzy</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>${COMPANY_INFO.name}</strong></p>
      <p>${COMPANY_INFO.address.street}, ${COMPANY_INFO.address.city}</p>
      <p>Tel: ${COMPANY_INFO.phone.display} | Email: ${COMPANY_INFO.email.display}</p>
      <p>© ${new Date().getFullYear()} Subzy. Alle rechten voorbehouden.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Contact form submission - notification to admin
 */
export function contactFormAdminTemplate({ naam, email, telefoon, onderwerp, bericht }) {
  const onderwerpLabels = {
    energiebelasting: "Teruggave Energiebelasting",
    subsidie: "Duurzaamheidssubsidie",
    lopende_aanvraag: "Lopende aanvraag",
    klantportaal: "Probleem met Klantportaal",
    anders: "Anders",
  };

  const html = `
    <h2>Nieuw Contactformulier Bericht</h2>
    <p>Er is een nieuw bericht ontvangen via het contactformulier op de website.</p>
    
    <div class="info-box">
      <p><strong>Naam:</strong> ${naam}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Telefoon:</strong> ${telefoon || "Niet opgegeven"}</p>
      <p><strong>Onderwerp:</strong> ${onderwerpLabels[onderwerp] || onderwerp}</p>
    </div>
    
    <div class="divider"></div>
    
    <h3>Bericht:</h3>
    <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 6px;">${bericht}</p>
    
    <div class="divider"></div>
    
    <p><a href="mailto:${email}?subject=Re: ${onderwerpLabels[onderwerp] || onderwerp}" class="button">Beantwoord direct</a></p>
  `;

  const text = `
Nieuw Contactformulier Bericht

Naam: ${naam}
E-mail: ${email}
Telefoon: ${telefoon || "Niet opgegeven"}
Onderwerp: ${onderwerpLabels[onderwerp] || onderwerp}

Bericht:
${bericht}
  `;

  return {
    html: baseTemplate(html),
    text: text.trim(),
  };
}

/**
 * Contact form submission - confirmation to sender
 */
export function contactFormConfirmationTemplate({ naam }) {
  const html = `
    <h2>Bedankt voor uw bericht, ${naam}!</h2>
    
    <p>Wij hebben uw bericht in goede orde ontvangen en zullen zo spoedig mogelijk contact met u opnemen.</p>
    
    <div class="info-box">
      <p><strong>Verwachte reactietijd:</strong> Binnen 1 werkdag</p>
      <p><strong>Vragen?</strong> Bel ons op ${COMPANY_INFO.phone.display}</p>
    </div>
    
    <p>Met vriendelijke groet,</p>
    <p><strong>Team Subzy</strong></p>
  `;

  const text = `
Bedankt voor uw bericht, ${naam}!

Wij hebben uw bericht in goede orde ontvangen en zullen zo spoedig mogelijk contact met u opnemen.

Verwachte reactietijd: Binnen 1 werkdag
Vragen? Bel ons op ${COMPANY_INFO.phone.display}

Met vriendelijke groet,
Team Subzy
  `;

  return {
    html: baseTemplate(html),
    text: text.trim(),
  };
}

/**
 * Intake form submission - notification to admin
 */
export function intakeFormAdminTemplate({ type, adres, stad, postcode, email, naam }) {
  const typeLabels = {
    energie: "Teruggave Energiebelasting",
    duurzaam: "Duurzaamheidssubsidie",
  };

  const html = `
    <h2>Nieuwe Intake Aanvraag</h2>
    <p>Er is een nieuwe intake aanvraag ontvangen via de website.</p>
    
    <div class="info-box">
      <p><strong>Type aanvraag:</strong> ${typeLabels[type] || type}</p>
      <p><strong>Naam:</strong> ${naam || "Niet opgegeven"}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
    </div>
    
    <h3>Adresgegevens:</h3>
    <p>
      ${adres}<br>
      ${postcode} ${stad}
    </p>
    
    <div class="divider"></div>
    
    <p><a href="mailto:${email}" class="button">Neem contact op</a></p>
  `;

  const text = `
Nieuwe Intake Aanvraag

Type: ${typeLabels[type] || type}
Naam: ${naam || "Niet opgegeven"}
E-mail: ${email}

Adresgegevens:
${adres}
${postcode} ${stad}
  `;

  return {
    html: baseTemplate(html),
    text: text.trim(),
  };
}

/**
 * Generic notification template
 */
export function notificationTemplate({ title, message, ctaText, ctaUrl }) {
  const html = `
    <h2>${title}</h2>
    <p>${message}</p>
    ${ctaText && ctaUrl ? `<p><a href="${ctaUrl}" class="button">${ctaText}</a></p>` : ""}
  `;

  return {
    html: baseTemplate(html),
    text: `${title}\n\n${message}${ctaText && ctaUrl ? `\n\n${ctaText}: ${ctaUrl}` : ""}`,
  };
}
