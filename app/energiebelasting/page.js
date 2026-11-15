import { Footer, Header, TopBar } from "@/components/layout";
import {
  Eligibility,
  HowItWorksTimeline,
  MidCTA,
  ProblemAwareness,
  ServiceFAQ,
  ServiceHero,
} from "./components";
import { faqPageSchema, faqSets, pickFaqs } from "@/lib/faq";

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
  ...faqPageSchema(pickFaqs(faqSets.energiebelasting)),
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
        <div className="bg-background">
          <ServiceHero />
        </div>
        <ProblemAwareness />
        <HowItWorksTimeline />
        <Eligibility />
        <MidCTA />
        <ServiceFAQ />
      </main>
      <Footer />
    </>
  );
}
