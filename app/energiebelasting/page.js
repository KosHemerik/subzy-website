import { Footer, Header, TopBar } from "@/components/layout";
import {
    Eligibility,
    HowItWorksTimeline,
    MidCTA,
    ProblemAwareness,
    ServiceFAQ,
    ServiceHero,
  TestimonialsCarousel,
} from "./components";

const BASE_URL = "https://subzy.nl";
const PAGE_URL = `${BASE_URL}/energiebelasting`;

export const metadata = {
  title: "Energiebelasting Terugvragen | Teruggave via Subzy",
  description:
    "Betaalt u te veel energiebelasting? Subzy regelt uw teruggave tot 5 jaar terug — No Cure No Pay. Gemiddeld €640 per woning. Vraag een gratis scan aan.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Energiebelasting Terugvragen | Subzy",
    description:
      "Gemiddeld €640 teruggave per woning. No Cure No Pay. Vraag nu een gratis scan aan — binnen 2 werkdagen duidelijkheid.",
    url: PAGE_URL,
    siteName: "Subzy",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energiebelasting Terugvragen | Subzy",
    description:
      "Gemiddeld €640 teruggave per woning. No Cure No Pay. Gratis scan aanvragen.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wat is teruggave energiebelasting precies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De heffingskorting op energiebelasting wordt in de praktijk vaak maar een keer per aansluiting verrekend, terwijl u er per zelfstandig WOZ-object recht op heeft. Daardoor betalen veel eigenaren structureel te veel.",
      },
    },
    {
      "@type": "Question",
      name: "Hoeveel kan ik terugkrijgen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In 2025 is de heffingskorting €635,19 inclusief btw per extra woning per jaar. Omdat u tot 5 jaar terug kunt corrigeren, kan dit oplopen tot ruim €3.000 per woning.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe ver terug kan ik energiebelasting terugvragen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "U kunt het lopende jaar plus de 4 voorgaande kalenderjaren terugvragen.",
      },
    },
    {
      "@type": "Question",
      name: "Waarom krijg ik die korting niet automatisch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De energieleverancier ziet meestal maar één aansluiting (EAN) en past de korting daarom vaak maar één keer toe. De Belastingdienst corrigeert dit doorgaans alleen als u hier expliciet om verzoekt.",
      },
    },
  ],
};

export default function TeruggaveEnergiebelastingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TopBar />
      <Header />
      <main className="bg-white">
        <ServiceHero />
        <ProblemAwareness />
        <HowItWorksTimeline />
        <Eligibility />
        <MidCTA />
        <TestimonialsCarousel />
        <ServiceFAQ />
      </main>
      <Footer />
    </>
  );
}
