// Eén bron voor alle veelgestelde vragen op de site (/faq, homepage, service-
// en subsidiepagina's) en de bijbehorende FAQPage-schema's.
//
// Antwoorden mogen links bevatten als [tekst](/pad). Op de pagina worden dat
// echte links, in de JSON-LD alleen de tekst (zie faqPlainText).
//
// Bedragen en termijnen volgens Belastingdienst en RVO (stand 2026).
// Bronnen: rvo.nl/subsidies-financiering/isde/woningeigenaren,
// rvo.nl/subsidies-financiering/isde-wat-wijzigt-er-2026,
// rvo.nl/subsidies-financiering/svoh
// Controleer de heffingskorting en ISDE-bedragen elk jaar.

export const faqCategories = [
  { id: "algemeen", label: "Algemeen", icon: "fa-regular fa-comment-dots" },
  { id: "energiebelasting", label: "Teruggave Energiebelasting", icon: "fa-solid fa-bolt" },
  { id: "isde", label: "ISDE & Warmtepomp", icon: "fa-solid fa-leaf" },
  { id: "svoh", label: "SVOH (Verhuurders & VvE)", icon: "fa-solid fa-building" },
  { id: "proces", label: "Proces & Portaal", icon: "fa-solid fa-list-check" },
  { id: "kosten", label: "Kosten & Voorwaarden", icon: "fa-solid fa-euro-sign" },
];

export const faqData = {
  algemeen: {
    title: "Algemene Vragen",
    questions: [
      {
        id: "wat-doet-subzy",
        question: "Wat doet Subzy precies?",
        answer:
          "Subzy helpt woningeigenaren, verhuurders en VvE's in Nederland bij het terugvragen van te veel betaalde [energiebelasting](/energiebelasting) en het aanvragen van [duurzaamheidssubsidies](/subsidie) zoals de ISDE en de SVOH. Wij nemen het papierwerk en de communicatie met de Belastingdienst en RVO volledig uit handen.",
      },
      {
        id: "in-aanmerking",
        question: "Hoe weet ik of ik in aanmerking kom?",
        answer:
          "Doe een gratis en vrijblijvende check voor [teruggave energiebelasting](/energiebelasting/aanvragen) of [duurzaamheidssubsidie](/subsidie/aanvragen). U vult enkele basisgegevens in en wij beoordelen of u in aanmerking komt en wat de verwachte opbrengst is.",
      },
      {
        id: "overheid",
        question: "Is Subzy een onderdeel van de overheid?",
        answer:
          "Nee, Subzy is een onafhankelijk, commercieel adviesbureau. Wij treden op als uw gemachtigde en dienen namens u de aanvragen in bij de Belastingdienst en RVO.",
      },
      {
        id: "hoe-lang-bestaat",
        question: "Hoe lang bestaat Subzy al?",
        answer:
          "Subzy is opgericht in 2020 en heeft sindsdien meer dan 1.400 succesvolle aanvragen verzorgd voor woningeigenaren, verhuurders en VvE's door heel Nederland. Lees meer [over ons](/over-ons).",
      },
      {
        id: "huurder",
        question: "Kan ik ook als huurder gebruik maken van jullie diensten?",
        answer:
          "Voor de meeste subsidies en teruggaves moet u eigenaar zijn van de woning. Heeft u als huurder zelf een warmtepomp of isolatie laten aanbrengen met toestemming van de verhuurder, dan kunt u in sommige gevallen toch subsidie krijgen. [Neem contact met ons op](/contact) voor uw specifieke situatie.",
      },
    ],
  },
  energiebelasting: {
    title: "Teruggave Energiebelasting",
    questions: [
      {
        id: "eb-wat-is",
        question: "Wat is de Teruggave Energiebelasting?",
        answer:
          "Op uw energierekening krijgt u een vaste korting op de energiebelasting: de heffingskorting. U heeft recht op die korting per zelfstandige woning (WOZ-object). Zitten meerdere woningen of units achter één elektriciteitsaansluiting, dan wordt de korting maar één keer verrekend. Via een teruggaafverzoek bij de Belastingdienst krijgt u de gemiste korting voor de andere woningen alsnog terug.",
      },
      {
        id: "eb-wie",
        question: "Wie komt in aanmerking voor teruggave energiebelasting?",
        answer:
          "Eigenaren en verhuurders van een pand met meerdere zelfstandige woningen, appartementen of units (WOZ-objecten) achter één elektriciteitsaansluiting. [Vraag onze gratis scan aan](/energiebelasting/aanvragen), dan beoordelen wij binnen 2 werkdagen of u in aanmerking komt.",
      },
      {
        id: "eb-heffingskorting-2026",
        question: "Hoe hoog is de heffingskorting in 2026?",
        answer:
          "In 2026 bedraagt de heffingskorting € 628,96 per jaar inclusief btw (€ 519,80 exclusief btw). In 2025 was dit € 635,19 inclusief btw.",
      },
      {
        id: "eb-hoeveel",
        question: "Hoeveel kan ik terugkrijgen?",
        answer:
          "Per extra zelfstandige woning achter één aansluiting krijgt u de heffingskorting terug: € 628,96 per jaar in 2026 en € 635,19 in 2025. Omdat u tot 5 jaar terug kunt vorderen, kan dit oplopen tot ruim € 3.000 per woning. Wij berekenen het exacte bedrag na de [gratis scan](/energiebelasting/aanvragen).",
      },
      {
        id: "eb-hoe-ver-terug",
        question: "Hoe ver terug kan ik de teruggave aanvragen?",
        answer:
          "U kunt de teruggave tot 5 jaar terug aanvragen. Wacht dus niet te lang: elk jaar dat verloopt, kunt u niet meer terugvragen.",
      },
      {
        id: "eb-jaarlijks",
        question: "Moet ik ieder jaar opnieuw een aanvraag indienen?",
        answer:
          "Ja, de teruggave wordt per jaar aangevraagd. Als u dat wilt, verzorgen wij dit elk jaar automatisch voor u, zodat u geen teruggave misloopt.",
      },
      {
        id: "eb-waarom-niet",
        question: "Waarom heeft de Belastingdienst of mijn energieleverancier mij hier niet op gewezen?",
        answer:
          "Uw energieleverancier ziet maar één aansluiting (EAN-code) en verrekent de heffingskorting daarom maar één keer. Hoeveel zelfstandige woningen erachter zitten, weet de leverancier niet. De Belastingdienst corrigeert dit alleen als u er zelf een verzoek voor indient. Daardoor lopen veel eigenaren jarenlang geld mis zonder het te weten.",
      },
      {
        id: "eb-legaal",
        question: "Is dit legaal?",
        answer:
          "Ja, de Teruggave Energiebelasting is een wettelijke regeling. Wij dienen het verzoek namens u in bij de Belastingdienst via de daarvoor bestemde procedure.",
      },
    ],
  },
  isde: {
    title: "ISDE & Warmtepomp",
    questions: [
      {
        id: "isde-wat-is",
        question: "Wat is de ISDE-subsidie?",
        answer:
          "De ISDE (Investeringssubsidie Duurzame Energie en Energiebesparing) is een subsidie van de overheid, uitgevoerd door RVO, voor woningeigenaren die hun woning verduurzamen. U krijgt een vast bedrag per maatregel, bijvoorbeeld voor een warmtepomp of isolatie. [Vraag uw ISDE-subsidie aan](/subsidie/aanvragen/isde).",
      },
      {
        id: "isde-maatregelen",
        question: "Welke maatregelen komen in aanmerking voor ISDE?",
        answer:
          "Warmtepompen (ook hybride), zonneboilers, isolatie (dak, gevel, spouwmuur, vloer of bodem en HR++ of triple glas), aansluiting op een warmtenet en ventilatie in combinatie met isolatie. Per maatregel gelden specifieke voorwaarden, zoals een minimale isolatiewaarde.",
      },
      {
        id: "wp-hoeveel",
        question: "Hoeveel subsidie krijg ik voor een warmtepomp in 2026?",
        answer:
          "Voor een eerste lucht-waterwarmtepomp (ook hybride) krijgt u in 2026 een startbedrag van € 1.025, plus € 225 per kW vermogen, plus € 200 extra bij energielabel A+++. Een warmtepomp van 4 kW met label A+++ levert zo € 2.125 op, en u krijgt altijd minimaal € 500. Voor grond-water- en water-waterwarmtepompen en warmtepompboilers staat het bedrag per model op de meldcodelijst van RVO. Bereken uw bedrag met onze [warmtepompsubsidie-calculator](/subsidie/warmtepomp).",
      },
      {
        id: "isde-isolatie-hoeveel",
        question: "Hoeveel subsidie krijg ik voor isolatie of ventilatie?",
        answer:
          "Voor isolatie krijgt u een vast bedrag per m², afhankelijk van het type isolatie. Combineert u maatregelen, dan verdubbelt dat bedrag. Voor ventilatie in combinatie met isolatie krijgt u eenmalig € 400. Wij berekenen het exacte bedrag voor u.",
      },
      {
        id: "isde-combineren",
        question: "Kan ik meerdere maatregelen combineren?",
        answer:
          "Ja, en dat loont. Voert u binnen 24 maanden twee of meer maatregelen uit, bijvoorbeeld een [warmtepomp](/subsidie/warmtepomp) én isolatie, of twee isolatiemaatregelen, dan verdubbelt het subsidiebedrag voor de isolatie. Wij nemen alle maatregelen voor u mee in de aanvraag.",
      },
      {
        id: "isde-eerst-aanvragen",
        question: "Moet ik eerst aanvragen of eerst installeren?",
        answer:
          "Als particuliere woningeigenaar laat u de maatregel eerst uitvoeren en vraagt u de ISDE daarna aan, binnen 24 maanden na installatie. Als ondernemer moet u juist vóóraf aanvragen, voordat u een offerte tekent of opdracht geeft; een zakelijke aanvraag achteraf wordt afgewezen. Verhuurders (SVOH) vragen bij minder dan € 25.000 subsidie achteraf aan.",
      },
      {
        id: "isde-termijn",
        question: "Binnen welke termijn moet ik de ISDE-subsidie aanvragen?",
        answer:
          "Als particulier vraagt u de subsidie uiterlijk 24 maanden na de installatie aan. De installatiedatum op de factuur is hierbij leidend.",
      },
      {
        id: "wp-te-laat",
        question: "Mijn warmtepomp is al geïnstalleerd. Ben ik te laat?",
        answer:
          "Als particulier waarschijnlijk niet: u heeft 24 maanden na de installatiedatum om aan te vragen. Is de installatie langer dan 24 maanden geleden, dan kunt u geen ISDE meer aanvragen. Bent u ondernemer en heeft u al opdracht gegeven zonder vooraf aan te vragen, dan komt u helaas niet meer in aanmerking.",
      },
      {
        id: "wp-hybride",
        question: "Krijg ik subsidie voor een hybride warmtepomp?",
        answer:
          "Ja. Een hybride warmtepomp is een lucht-waterwarmtepomp die samenwerkt met uw cv-ketel. Het bedrag wordt op dezelfde manier berekend: € 1.025 startbedrag plus € 225 per kW, en € 200 extra bij label A+++.",
      },
      {
        id: "wp-tweede",
        question: "Krijg ik subsidie voor een tweede warmtepomp?",
        answer:
          "Ja, maar minder. Voor een tweede of volgende lucht-waterwarmtepomp die in 2026 wordt geïnstalleerd, krijgt u alleen € 225 per kW, zonder startbedrag en zonder labelbonus. Dat geldt ook als u de subsidie voor de eerste warmtepomp al in 2025 of eerder kreeg.",
      },
      {
        id: "wp-uitgesloten",
        question: "Welke warmtepompen komen niet in aanmerking?",
        answer:
          "Geen subsidie is er voor tweedehands warmtepompen, lucht-luchtwarmtepompen (airco's), warmtepompdrogers en warmtepompen die u zelf installeert. Sinds 2026 vallen ook split lucht-waterwarmtepompen met een vulgewicht onder 3 kg en een GWP boven 750 af. Wij controleren dit voor u aan de hand van de meldcode.",
      },
      {
        id: "wp-2024",
        question: "Ik heb mijn warmtepomp in 2024 gekocht maar later laten installeren. Welk bedrag geldt?",
        answer:
          "Kocht u de warmtepomp in 2024 en werd hij in 2025 of 2026 geïnstalleerd? Dan geldt het hogere bedrag van 2024, als u kunt aantonen dat u in 2024 kocht. Bijvoorbeeld met een opdrachtbevestiging of een digitaal ondertekende offerte.",
      },
      {
        id: "isde-installateur",
        question: "Moet de installateur erkend zijn?",
        answer:
          "De maatregel moet door een bedrijf zijn uitgevoerd; zelf installeren komt niet in aanmerking. Een warmtepomp of zonneboiler moet bovendien op de meldcodelijst van RVO staan. Wij controleren dit voor u tijdens de aanvraag.",
      },
    ],
  },
  svoh: {
    title: "SVOH (Verhuurders & VvE)",
    questions: [
      {
        id: "svoh-wat-is",
        question: "Wat is de SVOH-subsidie?",
        answer:
          "De SVOH (Subsidieregeling Verduurzaming en Onderhoud Huurwoningen) is een subsidie van RVO voor verhuurders die hun huurwoningen verduurzamen. Particuliere en zakelijke verhuurders en beleggers komen in aanmerking; woningcorporaties niet. De regeling loopt tot en met 31 december 2029. [Vraag uw SVOH-subsidie aan](/subsidie/aanvragen/svoh).",
      },
      {
        id: "svoh-vs-isde",
        question: "Wat is het verschil tussen ISDE en SVOH?",
        answer:
          "De ISDE is bedoeld voor woningeigenaren die zelf in hun woning wonen. De SVOH is speciaal voor verhuurde woningen en vergoedt naast verduurzaming ook bepaalde onderhoudsmaatregelen. Verhuurt u de woning, dan bepalen wij welke regeling voor u het meeste oplevert.",
      },
      {
        id: "svoh-maatregelen",
        question: "Welke maatregelen komen in aanmerking voor SVOH?",
        answer:
          "Onder meer isolatie, hoogrendementsglas, ventilatie, warmtepompen, zonneboilers en een maatwerkadvies. Daarnaast kunt u subsidie krijgen voor onderhoudsmaatregelen, zoals buitenkozijnen en ventilatieboxen.",
      },
      {
        id: "svoh-hoeveel",
        question: "Hoeveel SVOH-subsidie kan ik krijgen?",
        answer:
          "Per maatregel geldt een vast bedrag. Per woning ontvangt u maximaal € 15.000 als u een warmtepomp of zonneboiler laat plaatsen, en maximaal € 10.000 zonder warmtepomp of zonneboiler.",
      },
      {
        id: "svoh-voorwaarden",
        question: "Aan welke voorwaarden moet de woning voldoen?",
        answer:
          "De woning moet een bestaande huurwoning zijn die in de Basisregistratie Adressen en Gebouwen (BAG) staat, en moet al verhuurd zijn voordat de maatregelen worden uitgevoerd.",
      },
      {
        id: "svoh-vve",
        question: "Kan een VvE SVOH aanvragen?",
        answer:
          "Verhuurt u alle woningen in een gebouw, dan kunt u SVOH op gebouwniveau aanvragen voor werkzaamheden die na 31 december 2024 zijn uitgevoerd. Bij een gemengde VvE, met zowel eigenaar-bewoners als verhuurders, is SVOH niet mogelijk. [Neem contact met ons op](/contact), dan kijken we wat voor uw VvE wel kan.",
      },
      {
        id: "svoh-eerst-aanvragen",
        question: "Moet ik eerst aanvragen of eerst de werkzaamheden uitvoeren?",
        answer:
          "Bij een subsidiebedrag onder € 25.000 laat u eerst de maatregelen uitvoeren en vraagt u daarna aan, uiterlijk 24 maanden na uitvoering. Bij € 25.000 of meer vraagt u vóór de start van de werkzaamheden aan.",
      },
    ],
  },
  proces: {
    title: "Proces & Portaal",
    questions: [
      {
        id: "proces-stappen",
        question: "Hoe werkt het aanvraagproces?",
        answer:
          "1. U doet een gratis check en wij beoordelen of u in aanmerking komt. 2. U geeft ons een machtiging en levert de benodigde documenten aan via ons klantportaal. 3. Wij controleren alles en dienen de aanvraag binnen 2 werkdagen in. 4. De Belastingdienst of RVO neemt een besluit en betaalt rechtstreeks aan u uit. 5. Pas na toekenning ontvangt u onze factuur.",
      },
      {
        id: "doorlooptijd",
        question: "Hoe lang duurt een aanvraag?",
        answer:
          "Zodra alle documenten compleet zijn, dienen wij uw aanvraag binnen 2 werkdagen in. Daarna geldt: bij teruggave energiebelasting staat het geld gemiddeld na 6 tot 8 weken op uw rekening. Bij ISDE streeft RVO ernaar binnen 8 weken een besluit te nemen. Bij SVOH beslist RVO uiterlijk binnen 13 weken.",
      },
      {
        id: "documenten",
        question: "Welke documenten heb ik nodig?",
        answer:
          "Voor de gratis check heeft u nog niets nodig. Pas bij de aanvraag vragen wij om documenten. Voor teruggave energiebelasting: uw energiejaarafrekening (energienota) en de WOZ-beschikking van het pand. Voor ISDE: de factuur van de installateur (met merk, type en installatiedatum), een betaalbewijs en foto's van de maatregel. Voor SVOH: onder meer de facturen en betaalbewijzen van de werkzaamheden. In ons klantportaal ziet u precies wat er nog nodig is.",
      },
      {
        id: "machtiging",
        question: "Wat is een machtiging en heb ik DigiD nodig?",
        answer:
          "Met een machtiging geeft u Subzy toestemming om namens u gegevens op te vragen en aanvragen in te dienen bij de Belastingdienst, RVO en uw energieleverancier. U geeft de machtiging digitaal af bij het starten van uw aanvraag. U hoeft uw DigiD-gegevens nooit met ons te delen. De uitbetaling gaat altijd rechtstreeks naar uw eigen rekening, en u kunt de machtiging op elk moment intrekken.",
      },
      {
        id: "portaal",
        question: "Hoe werkt het klantportaal?",
        answer:
          "Na aanmelding krijgt u toegang tot ons beveiligde klantportaal. Hier uploadt u uw documenten, volgt u de status van uw aanvraag en ziet u direct een melding als wij nog een document van u nodig hebben.",
      },
      {
        id: "veiligheid",
        question: "Hoe veilig zijn mijn documenten?",
        answer:
          "Uw documenten staan in een beveiligd klantportaal waar alleen u en onze specialisten toegang toe hebben. Wij werken volgens de AVG en gebruiken uw gegevens uitsluitend voor uw aanvraag. Wij delen ze alleen met de instantie waar wij de aanvraag indienen. Lees meer in onze [privacyverklaring](/privacy).",
      },
      {
        id: "afwijzing",
        question: "Wat gebeurt er als mijn aanvraag wordt afgewezen?",
        answer:
          "Wordt uw aanvraag onverhoopt afgewezen, dan onderzoeken wij de mogelijkheden voor bezwaar. U betaalt in dat geval niets. Wij voorkomen afwijzingen zoveel mogelijk door uw aanvraag vooraf grondig te controleren.",
      },
    ],
  },
  kosten: {
    title: "Kosten & Voorwaarden",
    questions: [
      {
        id: "kosten",
        question: "Wat kost jullie dienstverlening?",
        answer:
          "Voor de teruggave energiebelasting werken we op basis van No Cure, No Pay: we rekenen 20% excl. btw over het bedrag dat aan u wordt toegekend. Voor subsidieaanvragen (ISDE en SVOH) rekenen we een vast tarief van € 79 incl. btw, plus € 15 incl. btw per extra maatregel. Wordt er niets toegekend? Dan betaalt u ook niets.",
      },
      {
        id: "vooraf-kosten",
        question: "Zijn er vooraf kosten of loop ik financieel risico?",
        answer:
          "Nee. U betaalt alleen als uw aanvraag wordt toegekend, ook bij het vaste tarief voor subsidieaanvragen. De check, het dossier en de indiening zijn gratis. U loopt dus geen financieel risico.",
      },
      {
        id: "jaarlijkse-opvolging",
        question: "Wat kost de jaarlijkse opvolging en kan ik daarmee stoppen?",
        answer:
          "Voor de jaarlijkse opvolging van de teruggave energiebelasting betaalt u hetzelfde tarief: 20% excl. btw over het bedrag dat dat jaar wordt toegekend. Wordt er niets toegekend, dan betaalt u niets. U kunt de opvolging altijd schriftelijk opzeggen met een opzegtermijn van één maand; verzoeken die al zijn ingediend, ronden wij af. Zie [artikel 11 van onze algemene voorwaarden](/voorwaarden#artikel-11).",
      },
      {
        id: "betaling",
        question: "Hoe wordt de betaling afgehandeld?",
        answer:
          "Zodra de Belastingdienst of RVO uw aanvraag heeft goedgekeurd en de teruggave of subsidie is toegekend, ontvangt u een factuur van ons. U maakt het bedrag over per bankoverschrijving, binnen 14 dagen na factuurdatum.",
      },
      {
        id: "herroepen",
        question: "Kan ik de opdracht herroepen?",
        answer:
          "Ja. Als particulier kunt u de opdracht binnen 14 dagen zonder opgave van reden herroepen. Heeft u ons gevraagd direct te starten en is uw aanvraag binnen die 14 dagen al ingediend, dan vervalt het herroepingsrecht. Lees meer in [artikel 10 van onze algemene voorwaarden](/voorwaarden#artikel-10).",
      },
      {
        id: "terugvordering",
        question: "Wat als de Belastingdienst de teruggave later terugvordert?",
        answer:
          "Komt de terugvordering door een fout van Subzy, dan crediteren wij ons honorarium naar evenredigheid. Ligt de oorzaak niet bij ons, bijvoorbeeld door onjuiste gegevens die aan ons zijn verstrekt, dan blijft het honorarium verschuldigd. Zie [artikel 7.7 van onze algemene voorwaarden](/voorwaarden#artikel-7).",
      },
    ],
  },
};

// Welke vragen op welke pagina staan. Alle pagina's lezen uit faqData,
// zodat een antwoord overal hetzelfde is.
export const faqSets = {
  home: ["kosten", "doorlooptijd", "documenten", "veiligheid"],
  energiebelasting: [
    "eb-wat-is",
    "eb-hoeveel",
    "eb-heffingskorting-2026",
    "eb-hoe-ver-terug",
    "eb-waarom-niet",
    "kosten",
    "doorlooptijd",
  ],
  subsidie: ["svoh-vs-isde", "wp-hoeveel", "isde-combineren", "doorlooptijd", "vooraf-kosten"],
  isde: [
    "isde-wat-is",
    "isde-maatregelen",
    "wp-hoeveel",
    "isde-eerst-aanvragen",
    "isde-combineren",
    "doorlooptijd",
    "kosten",
    "isde-installateur",
  ],
  warmtepomp: [
    "wp-hoeveel",
    "isde-eerst-aanvragen",
    "wp-te-laat",
    "wp-hybride",
    "wp-tweede",
    "wp-uitgesloten",
    "wp-2024",
    "isde-combineren",
    "kosten",
  ],
};
