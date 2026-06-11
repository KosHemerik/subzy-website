import { TopBar, Header, Footer } from "@/components/layout";
import { ContactHero, ContactContent, FAQTeaser } from "./components";

const BASE_URL = "https://subzy.nl";
const PAGE_URL = `${BASE_URL}/contact`;

export const metadata = {
  title: "Contact | Subzy – Subsidies & Energiebelasting Teruggave",
  description: "Neem contact op met Subzy. Persoonlijk antwoord binnen 1 werkdag — geen chatbot. Vragen over subsidies, energiebelasting of een lopende aanvraag? Wij helpen u.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Contact | Subzy – Subsidies & Energiebelasting Teruggave",
    description: "Persoonlijk antwoord binnen 1 werkdag. Geen chatbot, geen wachtrij.",
    url: PAGE_URL,
    siteName: "Subzy",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact | Subzy",
    description: "Persoonlijk antwoord binnen 1 werkdag. Geen chatbot, geen wachtrij.",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Subzy B.V.",
  url: BASE_URL,
  telephone: "+31712032405",
  email: "info@subzy.nl",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Burggravenlaan 179",
    postalCode: "2313 HR",
    addressLocality: "Leiden",
    addressCountry: "NL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <TopBar />
      <Header />
      <main>
        <ContactHero />
        <ContactContent />
        <FAQTeaser />
      </main>
      <Footer />
    </>
  );
}
