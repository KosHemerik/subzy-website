import { Footer, Header, TopBar } from "@/components/layout";
import Link from "next/link";

export const metadata = {
  title: "Privacybeleid | Subzy",
  description:
    "Lees het privacybeleid van Subzy. Wij leggen uit hoe wij omgaan met uw persoonsgegevens, cookies en AVG-rechten zoals inzage, correctie en verwijdering.",
  alternates: {
    canonical: "https://subzy.nl/privacy",
  },
  openGraph: {
    title: "Privacybeleid | Subzy",
    description:
      "Lees het privacybeleid van Subzy. Wij leggen uit hoe wij omgaan met uw persoonsgegevens, cookies en AVG-rechten zoals inzage, correctie en verwijdering.",
    url: "https://subzy.nl/privacy",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: "Privacybeleid | Subzy",
    description:
      "Lees het privacybeleid van Subzy en hoe wij omgaan met uw persoonsgegevens.",
  },
};

const sections = [
  {
    id: "privacy",
    title: "Privacy",
    content: [
      "Wij respecteren de privacy van alle bezoekers van deze website. Persoonsgegevens (uw naam, telefoonnummer en e-mailadres) die via deze website worden verzameld ten behoeve van het leveren van informatie, worden uitsluitend gebruikt om aan uw verzoek te voldoen. Uw gegevens worden niet voor andere doeleinden gebruikt.",
      "Indien u uw gegevens uit onze database wilt laten verwijderen, of indien u uw gegevens wenst te corrigeren, kunt u contact met ons opnemen via onze contactpagina.",
      "Wij behouden te allen tijde het recht voor deze privacyverklaring te wijzigen conform de toepasselijke privacywetgeving. Wij raden u daarom aan deze website regelmatig te bezoeken voor de meest recente versie van onze privacyverklaring.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    content: [
      "Deze website maakt gebruik van webstatistieken. Door deze gegevens te analyseren kan de website nog beter op bezoekers worden afgestemd. De verzamelde gegevens worden niet voor een ander doel gebruikt of aan derden ter beschikking gesteld.",
      "Voor de opslag van deze gegevens maakt de website gebruik van cookies, logfiles en javascriptcodes op de pagina's. U kunt cookies uitschakelen via uw browserinstellingen, maar houd er rekening mee dat sommige functionaliteiten van de website dan mogelijk niet meer correct werken.",
    ],
  },
  {
    id: "persoonsgegevens",
    title: "Persoonsgegevens",
    content: [
      "Subzy verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG). Wij verwerken alleen de gegevens die noodzakelijk zijn voor het verlenen van onze diensten.",
      "Uw gegevens worden nooit verkocht aan derden. Wij delen uw gegevens uitsluitend met partijen die direct betrokken zijn bij de uitvoering van onze dienstverlening, zoals de Rijksdienst voor Ondernemend Nederland (RVO) of de Belastingdienst, en alleen voor zover dit noodzakelijk is.",
    ],
  },
  {
    id: "beveiliging",
    title: "Beveiliging",
    content: [
      "Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik en onbevoegde toegang. Onze website maakt gebruik van een beveiligde SSL-verbinding.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-bg py-16 curve-bottom w-full text-center px-4">
          <div className="max-w-3xl mx-auto relative z-10">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-2">
              Wij respecteren uw privacy
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Privacybeleid
            </h1>
            <div className="w-16 h-1 bg-yellow-400 rounded mx-auto" />
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background w-full px-4" aria-label="Privacybeleid inhoud">
          <div className="max-w-3xl mx-auto">
            {/* Table of contents */}
            <nav aria-label="Inhoudsopgave" className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Inhoud</p>
              <ol className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-secondary hover:text-accent text-sm font-medium transition"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className="text-secondary hover:text-accent text-sm font-medium transition">
                    Contact
                  </a>
                </li>
              </ol>
            </nav>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 divide-y divide-gray-100">
              <p className="text-gray-500 text-sm pb-8">
                Laatste bijgewerkt:{" "}
                <time dateTime="2026-05">mei 2026</time>
              </p>

              {sections.map((section) => (
                <div key={section.id} id={section.id} className="py-8 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Contact section — apart om mailto-link te renderen */}
              <div id="contact" className="py-8 scroll-mt-28">
                <h2 className="text-2xl font-bold text-primary mb-4">Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                  Heeft u vragen over ons privacybeleid of wilt u gebruik maken van uw rechten
                  (inzage, correctie of verwijdering van uw gegevens)? Neem dan contact met ons
                  op via{" "}
                  <a
                    href="mailto:info@subzy.nl"
                    className="text-secondary font-medium hover:text-accent transition"
                  >
                    info@subzy.nl
                  </a>{" "}
                  of via onze{" "}
                  <Link href="/contact" className="text-secondary font-medium hover:text-accent transition">
                    contactpagina
                  </Link>
                  .
                </p>
              </div>

              <div className="pt-8">
                <p className="text-gray-500 text-sm">
                  Vragen?{" "}
                  <Link href="/contact" className="text-secondary font-medium hover:text-accent transition">
                    Neem contact op
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
