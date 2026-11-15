// Bedragen en regels volgens RVO, ISDE 2026 (geldig vanaf 1 januari 2026).
// Bronnen: rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026,
// rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp,
// rvo.nl/subsidies-financiering/isde/zakelijke-gebruikers,
// rvo.nl/subsidies-financiering/svoh/svoh-verduurzamingsmaatregelen
// Controleer deze waarden elk jaar bij de nieuwe ISDE-regeling.
// De FAQ-teksten staan in lib/faq/faqData.js.

import { SUBSIDIE_TARIEF } from "@/lib/constants";
import { faqSets, pickFaqs } from "@/lib/faq";

export const ISDE_2026 = {
  startbedrag: 1025,
  perKw: 225,
  labelBonus: 200, // energielabel A+++, alleen eerste lucht-waterwarmtepomp
  minimum: 500,
};

export const SUBZY_TARIEF = SUBSIDIE_TARIEF;

export const faqItems = pickFaqs(faqSets.warmtepomp);
