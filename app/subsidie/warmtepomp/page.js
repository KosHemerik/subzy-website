import { Footer, Header, TopBar } from "@/components/layout";
import DocumentenEnKosten from "./components/DocumentenEnKosten";
import SituatieKiezer from "./components/SituatieKiezer";
import SubsidieCalculator from "./components/SubsidieCalculator";
import Voorwaarden from "./components/Voorwaarden";
import WarmtepompFAQ from "./components/WarmtepompFAQ";
import WarmtepompHero from "./components/WarmtepompHero";
import { faqItems } from "./data";

const URL = "https://subzy.nl/subsidie/warmtepomp";
const TITLE = "Warmtepomp Subsidie 2026 | Bedragen, Voorwaarden & Aanvragen | Subzy";
const DESCRIPTION =
  "Hoeveel subsidie krijgt u voor uw warmtepomp in 2026? Startbedrag € 1.025 + € 225 per kW. Bekijk de voorwaarden en laat Subzy uw aanvraag regelen voor € 79, No Cure No Pay.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": URL,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "nl-NL",
      isPartOf: { "@id": "https://subzy.nl" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://subzy.nl" },
        { "@type": "ListItem", position: 2, name: "Subsidie", item: "https://subzy.nl/subsidie" },
        { "@type": "ListItem", position: 3, name: "Warmtepomp", item: URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function WarmtepompPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <main>
        <WarmtepompHero />
        <SubsidieCalculator />
        <Voorwaarden />
        <DocumentenEnKosten />
        <SituatieKiezer />
        <WarmtepompFAQ />
      </main>
      <Footer />
    </>
  );
}
