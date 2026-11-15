import { Footer, Header, TopBar } from "@/components/layout";
import { allFaqs, faqData, faqPageSchema } from "@/lib/faq";
import { ContactCTA } from "./components";
import FAQShell from "./components/FAQShell";

const TITLE = "Veelgestelde vragen over energiebelasting & subsidie | Subzy";
const DESCRIPTION =
  "Antwoord op veelgestelde vragen over teruggave energiebelasting, de heffingskorting 2026, ISDE- en SVOH-subsidie, warmtepompsubsidie, kosten en het aanvraagproces.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://subzy.nl/faq",
      url: "https://subzy.nl/faq",
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "nl-NL",
      isPartOf: { "@id": "https://subzy.nl" },
    },
    faqPageSchema(allFaqs),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://subzy.nl" },
        { "@type": "ListItem", position: 2, name: "Veelgestelde Vragen", item: "https://subzy.nl/faq" },
      ],
    },
  ],
};

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://subzy.nl/faq",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://subzy.nl/faq",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function FAQPage({ searchParams }) {
  const { category, q } = await searchParams;
  const initialCategory = typeof category === "string" && faqData[category] ? category : "algemeen";
  const initialQuery = typeof q === "string" ? q : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <main>
        <FAQShell initialCategory={initialCategory} initialQuery={initialQuery} />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
