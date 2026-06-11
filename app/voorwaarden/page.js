import { Footer, Header, TopBar } from "@/components/layout";
import { COMPANY_INFO } from "@/lib/constants";
import Link from "next/link";

export const metadata = {
  title: "Algemene Voorwaarden | Subzy",
  description:
    "Lees de algemene voorwaarden van Subzy voor dienstverlening rondom energiebelasting teruggave en ISDE-subsidies. No cure no pay, honorarium, herroepingsrecht en meer.",
  alternates: {
    canonical: "https://subzy.nl/voorwaarden",
  },
  openGraph: {
    title: "Algemene Voorwaarden | Subzy",
    description:
      "Lees de algemene voorwaarden van Subzy voor dienstverlening rondom energiebelasting teruggave en ISDE-subsidies.",
    url: "https://subzy.nl/voorwaarden",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: "Algemene Voorwaarden | Subzy",
    description:
      "Lees de algemene voorwaarden van Subzy voor energiebelasting en subsidiedienstverlening.",
  },
};

function Section({ id, title, children }) {
  return (
    <div id={id} className="py-8 scroll-mt-28">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

const legalForm = COMPANY_INFO.name.includes("B.V.") ? "B.V." : "[RECHTSVORM]";
const officePlace = COMPANY_INFO.address.city.replace(/^[0-9]{4}\s?[A-Z]{2}\s+/i, "");
const officeAddress = COMPANY_INFO.address.full;
const contactEmail = COMPANY_INFO.email.display;
const contactEmailHref = COMPANY_INFO.email.href;
const kvkNumber = "65280121";
const noCureNoPayExVat = "20";
const noCureNoPayIncVat = "24,2";
const versionDate = "11-06-2026";

const tocItems = [
  { id: "artikel-1",  label: "Artikel 1 — Definities" },
  { id: "artikel-2",  label: "Artikel 2 — Toepasselijkheid" },
  { id: "artikel-3",  label: "Artikel 3 — Totstandkoming van de Overeenkomst" },
  { id: "artikel-4",  label: "Artikel 4 — Aard van de dienstverlening" },
  { id: "artikel-5",  label: "Artikel 5 — Machtiging" },
  { id: "artikel-6",  label: "Artikel 6 — Verplichtingen van Opdrachtgever" },
  { id: "artikel-7",  label: "Artikel 7 — Honorarium (no cure no pay)" },
  { id: "artikel-8",  label: "Artikel 8 — Betaling door zakelijke Opdrachtgevers" },
  { id: "artikel-9",  label: "Artikel 9 — Betaling door Consumenten" },
  { id: "artikel-10", label: "Artikel 10 — Herroepingsrecht Consumenten" },
  { id: "artikel-11", label: "Artikel 11 — Duur, jaarlijkse opvolging en opzegging" },
  { id: "artikel-12", label: "Artikel 12 — Privacy en gegevensverwerking" },
  { id: "artikel-13", label: "Artikel 13 — Klachten" },
  { id: "artikel-14", label: "Artikel 14 — Aansprakelijkheid" },
  { id: "artikel-15", label: "Artikel 15 — Overmacht" },
  { id: "artikel-16", label: "Artikel 16 — Toepasselijk recht en geschillen" },
];

export default function VoorwaardenPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <section className="hero-bg py-16 curve-bottom w-full text-center px-4">
          <div className="max-w-3xl mx-auto relative z-10">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-2">
              Juridische informatie
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Algemene Voorwaarden
            </h1>
            <div className="w-16 h-1 bg-yellow-400 rounded mx-auto" />
          </div>
        </section>

        <section className="py-16 bg-background w-full px-4" aria-label="Algemene Voorwaarden inhoud">
          <article className="max-w-5xl mx-auto">

            {/* Table of contents */}
            <nav aria-label="Inhoudsopgave" className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Inhoud</p>
              <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-secondary hover:text-accent text-sm font-medium transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 divide-y divide-gray-100">
              <p className="text-gray-500 text-sm pb-8">
                Laatste bijgewerkt:{" "}
                <time dateTime="2026-06-11">{versionDate}</time>
              </p>

              <Section id="artikel-1" title="Artikel 1 — Definities">
                <p>1.1 Opdrachtnemer: {COMPANY_INFO.name} (KvK {kvkNumber}), gevestigd te {officePlace}, kantoorhoudende aan {officeAddress}, hierna: "Subzy".</p>
                <p>1.2 Opdrachtgever: de natuurlijke persoon of rechtspersoon die aan Subzy opdracht geeft tot het verrichten van Diensten.</p>
                <p>1.3 Consument: een Opdrachtgever die handelt voor doeleinden buiten zijn bedrijfs- of beroepsactiviteit.</p>
                <p>1.4 Diensten: het beoordelen van de mogelijkheid tot, het voorbereiden en het indienen van verzoeken tot teruggaaf van energiebelasting bij de Belastingdienst, het aanvragen van subsidies (waaronder ISDE), alsmede alle daarmee samenhangende werkzaamheden.</p>
                <p>1.5 Teruggaaf: het bedrag dat de Belastingdienst of subsidieverstrekker naar aanleiding van een door of via Subzy ingediend verzoek bij beschikking toekent, inclusief eventuele btw en rentevergoedingen.</p>
                <p>1.6 Machtiging: de schriftelijke of digitale volmacht waarmee Opdrachtgever Subzy machtigt om namens hem op te treden richting de Belastingdienst, energieleverancier(s), netbeheerder(s) en/of subsidieverstrekkers.</p>
                <p>1.7 Overeenkomst: iedere overeenkomst tussen Subzy en Opdrachtgever tot het verrichten van Diensten, inclusief de Opdrachtbevestiging en deze Algemene Voorwaarden.</p>
              </Section>

              <Section id="artikel-2" title="Artikel 2 — Toepasselijkheid">
                <p>2.1 Deze Algemene Voorwaarden zijn van toepassing op alle aanbiedingen, offertes en Overeenkomsten van Subzy.</p>
                <p>2.2 Toepasselijkheid van algemene voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen.</p>
                <p>2.3 Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen en gelden uitsluitend voor de betreffende Overeenkomst.</p>
                <p>2.4 Indien een bepaling nietig is of vernietigd wordt, blijven de overige bepalingen onverkort van kracht. Partijen treden in overleg over een vervangende bepaling die het doel van de oorspronkelijke bepaling zo dicht mogelijk benadert.</p>
                <p>2.5 Subzy mag deze voorwaarden wijzigen. Wijzigingen gelden voor nieuwe Overeenkomsten en, na schriftelijke aankondiging met een termijn van ten minste een maand, voor lopende doorlopende Overeenkomsten. Een Consument mag bij een wezenlijke wijziging de Overeenkomst kosteloos opzeggen.</p>
              </Section>

              <Section id="artikel-3" title="Artikel 3 — Totstandkoming van de Overeenkomst">
                <p>3.1 Aanbiedingen van Subzy, waaronder de kosteloze check, zijn vrijblijvend.</p>
                <p>3.2 De Overeenkomst komt tot stand zodra Opdrachtgever de opdracht (digitaal) bevestigt en de Machtiging verstrekt, dan wel zodra Subzy met instemming van Opdrachtgever met de werkzaamheden is gestart.</p>
                <p>3.3 Indien de door Opdrachtgever verstrekte informatie onjuist of onvolledig blijkt, mag Subzy de Overeenkomst aanpassen of ontbinden.</p>
              </Section>

              <Section id="artikel-4" title="Artikel 4 — Aard van de dienstverlening (inspanningsverbintenis)">
                <p>4.1 Subzy voert de Diensten uit naar beste inzicht en vermogen. Op Subzy rust een inspanningsverbintenis, geen resultaatsverbintenis.</p>
                <p>4.2 Subzy garandeert niet dat een verzoek wordt toegewezen, noch de hoogte van een eventuele Teruggaaf. Door Subzy genoemde bedragen, gemiddelden en doorlooptijden zijn indicatief.</p>
                <p>4.3 De beslissing op een verzoek is voorbehouden aan de Belastingdienst respectievelijk de subsidieverstrekker. Subzy heeft geen invloed op de behandeltermijnen van deze instanties.</p>
                <p>4.4 Subzy dient uitsluitend verzoeken in waarvan zij, op basis van de verstrekte gegevens, inschat dat deze tot een positieve uitkomst kunnen leiden. Subzy mag het indienen van een verzoek weigeren zonder opgave van redenen; Opdrachtgever is in dat geval niets verschuldigd.</p>
              </Section>

              <Section id="artikel-5" title="Artikel 5 — Machtiging">
                <p>5.1 Voor de uitvoering van de Diensten verstrekt Opdrachtgever aan Subzy een Machtiging om namens hem: (a) informatie op te vragen bij de Belastingdienst, energieleveranciers en netbeheerders; (b) verzoeken tot teruggaaf en/of subsidieaanvragen in te dienen; en (c) over deze verzoeken te corresponderen.</p>
                <p>5.2 De Machtiging strekt niet tot het ontvangen van gelden namens Opdrachtgever: uitbetaling van een Teruggaaf vindt rechtstreeks plaats op het rekeningnummer van Opdrachtgever, tenzij uitdrukkelijk anders overeengekomen.</p>
                <p>5.3 Opdrachtgever kan de Machtiging te allen tijde intrekken. Intrekking nadat Subzy een verzoek heeft ingediend laat de honorariumverplichting van artikel 7 onverlet indien dat verzoek nadien tot een Teruggaaf leidt.</p>
              </Section>

              <Section id="artikel-6" title="Artikel 6 — Verplichtingen van Opdrachtgever">
                <p>6.1 Opdrachtgever verstrekt tijdig alle gegevens en documenten die Subzy nodig heeft, waaronder in ieder geval: jaarafrekening(en) van de energieleverancier, WOZ-beschikking(en) en, indien van toepassing, facturen en betaalbewijzen ten behoeve van subsidieaanvragen.</p>
                <p>6.2 Opdrachtgever staat in voor de juistheid, volledigheid en betrouwbaarheid van de verstrekte gegevens, ook indien deze van derden afkomstig zijn.</p>
                <p>6.3 Opdrachtgever informeert Subzy onverwijld over correspondentie die hij rechtstreeks van de Belastingdienst, energieleverancier of subsidieverstrekker ontvangt en die betrekking heeft op een door Subzy behandeld dossier, alsmede over ontvangst van een Teruggaaf.</p>
                <p>6.4 Opdrachtgever dient gedurende de looptijd van een dossier niet zelf, noch via een derde, een verzoek of aanvraag met hetzelfde onderwerp in te dienen, behoudens voorafgaande schriftelijke afstemming met Subzy.</p>
                <p>6.5 Vertraging, extra werkzaamheden of afwijzing als gevolg van het niet naleven van dit artikel komen voor rekening en risico van Opdrachtgever.</p>
              </Section>

              <Section id="artikel-7" title="Artikel 7 — Honorarium (no cure no pay)">
                <p>7.1 Subzy werkt op basis van no cure no pay. Opdrachtgever is uitsluitend een honorarium verschuldigd indien en voor zover een Teruggaaf bij beschikking wordt toegekend.</p>
                <p>7.2 Het honorarium bedraagt {noCureNoPayExVat}% van de toegekende Teruggaaf, exclusief btw. Voor Consumenten communiceert Subzy het tarief inclusief btw: {noCureNoPayIncVat}% van de Teruggaaf.</p>
                <p>7.3 Het honorarium wordt berekend over het totale bij beschikking toegekende bedrag, inclusief eventuele btw-component en rentevergoeding daarover.</p>
                <p>7.4 Wordt geen Teruggaaf toegekend, dan is Opdrachtgever niets verschuldigd — ook geen kosten voor de check, dossiervorming of indiening.</p>
                <p>7.5 Subzy factureert nadat de beschikking is afgegeven. Indien de Teruggaaf rechtstreeks aan Opdrachtgever wordt uitbetaald, geldt de betalingstermijn van artikel 8 respectievelijk 9.</p>
                <p>7.6 Het honorarium is eveneens verschuldigd indien: (a) een Teruggaaf wordt toegekend op een door Subzy voorbereid of ingediend verzoek, ook als Opdrachtgever de Overeenkomst tussentijds heeft beëindigd of de Machtiging heeft ingetrokken; of (b) Opdrachtgever in strijd met artikel 6.4 zelf of via een derde een Teruggaaf realiseert op basis van het door Subzy aangelegde dossier, binnen twaalf (12) maanden na beëindiging.</p>
                <p>7.7 Indien de Belastingdienst een toegekende Teruggaaf naderhand geheel of gedeeltelijk terugvordert om redenen die niet aan Subzy toerekenbaar zijn (bijvoorbeeld onjuiste gegevens van Opdrachtgever), blijft het honorarium verschuldigd. Is de terugvordering het gevolg van een aan Subzy toerekenbare fout, dan crediteert Subzy het honorarium naar evenredigheid.</p>
              </Section>

              <Section id="artikel-8" title="Artikel 8 — Betaling door zakelijke Opdrachtgevers">
                <p>8.1 Betaling vindt plaats binnen veertien (14) dagen na factuurdatum, zonder verrekening, korting of opschorting.</p>
                <p>8.2 Bezwaar tegen een factuur dient binnen veertien (14) dagen na factuurdatum schriftelijk en gemotiveerd te worden gemaakt. Bezwaar schort de betalingsverplichting niet op.</p>
                <p>8.3 Bij overschrijding van de betalingstermijn is Opdrachtgever van rechtswege in verzuim en is hij de wettelijke handelsrente verschuldigd, alsmede buitengerechtelijke incassokosten van 15% van de hoofdsom met een minimum van EUR 150.</p>
                <p>8.4 Subzy mag haar werkzaamheden (waaronder de jaarlijkse opvolging) opschorten zolang opeisbare facturen onbetaald zijn.</p>
              </Section>

              <Section id="artikel-9" title="Artikel 9 — Betaling door Consumenten">
                <p>9.1 Betaling vindt plaats binnen veertien (14) dagen na factuurdatum.</p>
                <p>9.2 Bij niet-tijdige betaling stuurt Subzy eerst een kosteloze betalingsherinnering met een termijn van veertien (14) dagen, onder vermelding van de gevolgen van uitblijvende betaling, conform artikel 6:96 lid 6 BW.</p>
                <p>9.3 Na het verstrijken van die termijn is de Consument de wettelijke rente verschuldigd, alsmede buitengerechtelijke incassokosten conform de Wet normering buitengerechtelijke incassokosten (WIK) en het Besluit vergoeding voor buitengerechtelijke incassokosten:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>15% over de eerste EUR 2.500 van de hoofdsom (minimum EUR 40);</li>
                  <li>10% over de volgende EUR 2.500;</li>
                  <li>5% over de volgende EUR 5.000;</li>
                  <li>1% over de volgende EUR 190.000;</li>
                  <li>0,5% over het meerdere, met een maximum van EUR 6.775 in totaal.</li>
                </ul>
              </Section>

              <Section id="artikel-10" title="Artikel 10 — Herroepingsrecht Consumenten">
                <p>10.1 Een Consument die de Overeenkomst op afstand (via de website, e-mail of telefoon) heeft gesloten, mag deze binnen veertien (14) dagen zonder opgave van redenen herroepen.</p>
                <p>10.2 Indien de Consument wenst dat Subzy direct, binnen de herroepingstermijn, met de werkzaamheden begint, verzoekt hij daar uitdrukkelijk om. Herroept de Consument daarna alsnog, dan is hij een evenredige vergoeding verschuldigd voor de reeds verrichte werkzaamheden.</p>
                <p>10.3 Is de Dienst binnen de herroepingstermijn op uitdrukkelijk verzoek van de Consument volledig uitgevoerd (het verzoek is ingediend), dan vervalt het herroepingsrecht; de Consument heeft daarvan bij zijn verzoek afstand gedaan.</p>
                <p>
                  10.4 Herroepen kan via{" "}
                  <a href={contactEmailHref} className="text-secondary font-medium hover:text-accent transition">
                    {contactEmail}
                  </a>{" "}
                  of met het wettelijke modelformulier voor herroeping.
                </p>
              </Section>

              <Section id="artikel-11" title="Artikel 11 — Duur, jaarlijkse opvolging en opzegging">
                <p>11.1 Tenzij anders overeengekomen wordt de Overeenkomst aangegaan voor het lopende dossier en de jaarlijkse opvolging daarvan: Subzy beoordeelt en verzorgt — na akkoord van Opdrachtgever per jaar, dan wel doorlopend op basis van de Machtiging — de teruggaafverzoeken voor opvolgende belastingjaren.</p>
                <p>11.2 Opdrachtgever kan de doorlopende dienstverlening te allen tijde schriftelijk opzeggen met een opzegtermijn van een (1) maand. Reeds ingediende verzoeken worden afgerond; daarop blijft artikel 7 van toepassing.</p>
                <p>11.3 Subzy mag de Overeenkomst met onmiddellijke ingang beëindigen of opschorten indien: (a) Opdrachtgever zijn verplichtingen niet nakomt; (b) sprake is van (een aanvraag tot) faillissement, surseance of schuldsanering van Opdrachtgever; (c) Opdrachtgever onjuiste gegevens heeft verstrekt; of (d) de relatie tussen partijen onherstelbaar is verstoord.</p>
              </Section>

              <Section id="artikel-12" title="Artikel 12 — Privacy en gegevensverwerking">
                <p>
                  12.1 Subzy verwerkt persoonsgegevens (waaronder NAW-gegevens, energie- en verbruiksgegevens, WOZ-gegevens en financiële gegevens) uitsluitend voor de uitvoering van de Overeenkomst en conform de AVG. Zie de{" "}
                  <Link href="/privacy" className="text-secondary font-medium hover:text-accent transition">
                    privacyverklaring
                  </Link>
                  .
                </p>
                <p>12.2 Subzy deelt gegevens uitsluitend met partijen die voor de uitvoering noodzakelijk zijn (zoals de Belastingdienst, energieleverancier of subsidieverstrekker) en bewaart dossiers niet langer dan wettelijk vereist of voor de dienstverlening noodzakelijk.</p>
                <p>12.3 Beide partijen behandelen vertrouwelijke informatie van de ander als zodanig en delen deze niet met derden die niet bij de Overeenkomst betrokken zijn.</p>
              </Section>

              <Section id="artikel-13" title="Artikel 13 — Klachten">
                <p>
                  13.1 Klachten over de uitvoering van de Diensten of over een factuur dienen binnen dertig (30) dagen na ontdekking, doch uiterlijk binnen zestig (60) dagen na afronding van het dossier, schriftelijk en gemotiveerd te worden gemeld via{" "}
                  <a href={contactEmailHref} className="text-secondary font-medium hover:text-accent transition">
                    {contactEmail}
                  </a>
                  .
                </p>
                <p>13.2 Subzy reageert binnen veertien (14) dagen inhoudelijk op de klacht.</p>
                <p>13.3 Indien een klacht gegrond is, zal Subzy naar haar keuze het gebrek kosteloos herstellen dan wel het honorarium geheel of gedeeltelijk crediteren. Het indienen van een klacht schort de betalingsverplichting van een zakelijke Opdrachtgever niet op.</p>
              </Section>

              <Section id="artikel-14" title="Artikel 14 — Aansprakelijkheid">
                <p>14.1 Subzy is uitsluitend aansprakelijk voor directe schade die het gevolg is van een aan haar toerekenbare tekortkoming. Aansprakelijkheid voor indirecte schade en gevolgschade (waaronder gederfde teruggaaf wegens verstreken termijnen veroorzaakt door te late of onjuiste aanlevering door Opdrachtgever, gederfde winst of reputatieschade) is uitgesloten.</p>
                <p>14.2 De aansprakelijkheid van Subzy is beperkt tot het bedrag dat haar beroeps- of bedrijfsaansprakelijkheidsverzekering in het betreffende geval uitkeert, vermeerderd met het eigen risico. Keert de verzekering niet uit, dan is de aansprakelijkheid beperkt tot het honorarium dat Subzy voor het betreffende dossier in rekening heeft gebracht of zou brengen.</p>
                <p>14.3 Subzy is niet aansprakelijk voor schade die het gevolg is van onjuiste of onvolledige informatie van Opdrachtgever, van beslissingen of termijnoverschrijdingen van de Belastingdienst of subsidieverstrekker, of van wijzigingen in wet- en regelgeving.</p>
                <p>14.4 De beperkingen in dit artikel gelden niet bij opzet of bewuste roekeloosheid van Subzy en laten dwingendrechtelijke rechten van Consumenten onverlet.</p>
                <p>14.5 Iedere vordering jegens Subzy vervalt twaalf (12) maanden nadat Opdrachtgever met de schade bekend is geworden of redelijkerwijs bekend had kunnen zijn.</p>
              </Section>

              <Section id="artikel-15" title="Artikel 15 — Overmacht">
                <p>15.1 Subzy is niet gehouden tot nakoming van enige verplichting indien zij daartoe verhinderd is als gevolg van overmacht, waaronder mede wordt verstaan: storingen bij de Belastingdienst of andere instanties, storingen in netwerken of systemen van derden, en overheidsmaatregelen.</p>
                <p>15.2 Duurt de overmacht langer dan zestig (60) dagen, dan mogen beide partijen de Overeenkomst schriftelijk beëindigen, zonder verplichting tot schadevergoeding.</p>
              </Section>

              <Section id="artikel-16" title="Artikel 16 — Toepasselijk recht en geschillen">
                <p>16.1 Op alle Overeenkomsten is Nederlands recht van toepassing.</p>
                <p>16.2 Geschillen worden voorgelegd aan de bevoegde rechter van het arrondissement Den Haag, tenzij dwingend recht anders bepaalt. Een Consument mag binnen een maand nadat Subzy zich op dit beding beroept, kiezen voor de volgens de wet bevoegde rechter.</p>
              </Section>

              <div className="pt-8">
                <p className="text-gray-500 text-sm">
                  Versie 1.0 — <time dateTime="2026-06-11">{versionDate}</time>. {COMPANY_INFO.name}, {officeAddress}, KvK {kvkNumber}. Vragen?{" "}
                  <Link href="/contact" className="text-secondary font-medium hover:text-accent transition">
                    Neem contact op
                  </Link>
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
