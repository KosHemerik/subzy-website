import { Footer, Header, TopBar } from "@/components/layout";
import {
    CoreValues,
    Mission,
    OverOnsCTA,
    OverOnsHero,
    Testimonials,
} from "./components";

const BASE_URL = "https://subzy.nl";
const PAGE_URL = `${BASE_URL}/over-ons`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Subzy",
  url: BASE_URL,
  logo: `${BASE_URL}/subzy_logo_transparant.png`,
  telephone: "+31712032405",
  email: "info@subzy.nl",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Burggravenlaan 179",
    postalCode: "2313 HR",
    addressLocality: "Leiden",
    addressCountry: "NL",
  },
  description:
    "Subzy helpt particuliere woningbezitters, verhuurders en VvE's bij het terugvragen van energiebelasting en het aanvragen van duurzaamheidssubsidies. No Cure No Pay.",
  areaServed: "NL",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
  },
};

export const metadata = {
  title: "Over Ons | Subzy – Specialist in Energiebelasting & Subsidies",
  description: "Maak kennis met Subzy. Wij helpen particuliere woningbezitters, verhuurders en VvE's bij teruggave energiebelasting en duurzaamheidssubsidies. Persoonlijk, transparant en No Cure No Pay.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Over Ons | Subzy – Specialist in Energiebelasting & Subsidies",
    description: "1.400+ aanvragen ingediend. No Cure No Pay. Persoonlijke begeleiding van begin tot eind.",
    url: PAGE_URL,
    siteName: "Subzy",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Over Ons | Subzy",
    description: "1.400+ aanvragen ingediend. No Cure No Pay. Persoonlijke begeleiding van begin tot eind.",
  },
};

export default function OverOnsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <TopBar />
      <Header />
      <main>
        <OverOnsHero />
        <Mission />
        <CoreValues />
        <Testimonials />
        <OverOnsCTA />
      </main>
      <Footer />
    </>
  );
}
