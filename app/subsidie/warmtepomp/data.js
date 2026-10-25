// Bedragen en regels volgens RVO, ISDE 2026 (geldig vanaf 1 januari 2026).
// Bronnen: rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026,
// rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp,
// rvo.nl/subsidies-financiering/isde/zakelijke-gebruikers,
// rvo.nl/subsidies-financiering/svoh/svoh-verduurzamingsmaatregelen
// Controleer deze waarden elk jaar bij de nieuwe ISDE-regeling.

export const ISDE_2026 = {
  startbedrag: 1025,
  perKw: 225,
  labelBonus: 200, // energielabel A+++, alleen eerste lucht-waterwarmtepomp
  minimum: 500,
};

export const SUBZY_TARIEF = { basis: 79, extraMaatregel: 15 };

export const faqItems = [
  {
    question: "Hoeveel subsidie krijg ik voor een warmtepomp in 2026?",
    answer:
      "Voor een eerste lucht-waterwarmtepomp (ook hybride) krijgt u in 2026 een startbedrag van € 1.025, plus € 225 per kW vermogen, plus € 200 extra bij energielabel A+++. Een warmtepomp van 4 kW met label A+++ levert zo € 2.125 op. U krijgt altijd minimaal € 500. Voor grond-water- en water-waterwarmtepompen en warmtepompboilers staat het bedrag per model op de meldcodelijst van RVO.",
  },
  {
    question: "Moet ik eerst aanvragen of eerst installeren?",
    answer:
      "Dat hangt af van uw situatie. Als particuliere woningeigenaar laat u de warmtepomp eerst installeren en vraagt u daarna aan, binnen 24 maanden na installatie. Als ondernemer moet u juist vóóraf aanvragen: vóórdat u een offerte tekent of opdracht geeft. Een zakelijke aanvraag achteraf wordt afgewezen. Verhuurders (SVOH) vragen bij minder dan € 25.000 subsidie achteraf aan, binnen 24 maanden.",
  },
  {
    question: "Mijn warmtepomp is al geïnstalleerd. Ben ik te laat?",
    answer:
      "Als particulier waarschijnlijk niet: u heeft 24 maanden na de installatiedatum om aan te vragen. Is de installatie langer dan 24 maanden geleden, dan kunt u geen ISDE meer aanvragen. Bent u ondernemer en heeft u al opdracht gegeven? Dan komt u helaas niet meer in aanmerking voor ISDE.",
  },
  {
    question: "Krijg ik subsidie voor een hybride warmtepomp?",
    answer:
      "Ja. Een hybride warmtepomp is een lucht-waterwarmtepomp die samenwerkt met uw cv-ketel. Het bedrag wordt op dezelfde manier berekend: € 1.025 startbedrag plus € 225 per kW, en € 200 extra bij label A+++.",
  },
  {
    question: "Krijg ik subsidie voor een tweede warmtepomp?",
    answer:
      "Ja, maar minder. Voor een tweede of volgende lucht-waterwarmtepomp die in 2026 wordt geïnstalleerd, krijgt u alleen € 225 per kW, zonder startbedrag en zonder labelbonus. Dat geldt ook als u de subsidie voor de eerste warmtepomp al in 2025 of eerder kreeg.",
  },
  {
    question: "Welke warmtepompen komen niet in aanmerking?",
    answer:
      "Geen subsidie is er voor tweedehands warmtepompen, lucht-luchtwarmtepompen (airco's), warmtepompdrogers en warmtepompen die u zelf installeert. Sinds 2026 vallen ook split lucht-waterwarmtepompen met een vulgewicht onder 3 kg en een GWP boven 750 af. Wij controleren dit voor u aan de hand van de meldcode.",
  },
  {
    question: "Ik heb mijn warmtepomp in 2024 gekocht maar later laten installeren. Welk bedrag geldt?",
    answer:
      "Kocht u de warmtepomp in 2024 en werd hij in 2025 of 2026 geïnstalleerd? Dan geldt het hogere bedrag van 2024, als u kunt aantonen dat u in 2024 kocht. Bijvoorbeeld met een opdrachtbevestiging of een digitaal ondertekende offerte.",
  },
  {
    question: "Kan ik warmtepompsubsidie combineren met isolatie?",
    answer:
      "Ja, en dat loont. Laat u binnen 24 maanden ook isoleren, dan verdubbelt het subsidiebedrag voor de isolatiemaatregel. Wij nemen beide maatregelen voor u mee in één aanvraag.",
  },
  {
    question: "Wat kost het om de aanvraag via Subzy te doen?",
    answer:
      "U betaalt een vast tarief van € 79 incl. btw, plus € 15 incl. btw per extra maatregel. Dat is op basis van No Cure No Pay: wordt de subsidie niet toegekend, dan betaalt u niets.",
  },
];
