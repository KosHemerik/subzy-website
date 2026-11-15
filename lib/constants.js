/**
 * Company Information Constants
 * Central place for all company details - update here to change everywhere
 */

export const COMPANY_INFO = {
  name: "Subzy",
  
  // Address
  address: {
    street: "Burggravenlaan 179",
    city: "2313 HR Leiden",
    full: "Burggravenlaan 179, 2313 HR Leiden",
  },
  
  // Contact
  phone: {
    display: "+31712032405",
    href: "tel:+31712032405",
  },
  email: {
    display: "info@subzy.nl",
    href: "mailto:info@subzy.nl",
  },
  
  // Opening Hours
  openingHours: {
    days: "Ma t/m Vrij",
    time: "09:00 - 17:00",
    full: "Ma t/m Vrij: 09:00 - 17:00",
  },
  
  // Rating
  rating: 4.8,

  // External review profiles
  googleReviews: {
    href: "https://www.google.com/search?q=Subzy+reviews",
  },
};

/**
 * Subzy-tarief voor subsidieaanvragen (ISDE en SVOH), incl. btw.
 * Alleen verschuldigd bij toekenning (No Cure No Pay).
 */
export const SUBSIDIE_TARIEF = { basis: 79, extraMaatregel: 15 };

export function subsidieKosten(aantalMaatregelen) {
  if (aantalMaatregelen <= 0) return 0;
  return SUBSIDIE_TARIEF.basis + (aantalMaatregelen - 1) * SUBSIDIE_TARIEF.extraMaatregel;
}
