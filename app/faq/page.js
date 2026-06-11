import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
import { faqData } from "./faqData";
import { ContactCTA } from "./components";
import FAQShell from "./components/FAQShell";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://subzy.nl/faq",
      url: "https://subzy.nl/faq",
      name: "Veelgestelde Vragen | Subzy",
      description:
        "Vind antwoord op de meest gestelde vragen over energiebelasting teruggave, ISDE-subsidies, het aanvraagproces en onze kosten.",
      inLanguage: "nl-NL",
      isPartOf: { "@id": "https://subzy.nl" },
    },
    {
      "@type": "FAQPage",
      mainEntity: Object.values(faqData).flatMap((category) =>
        category.questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        }))
      ),
    },
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
  title: "Veelgestelde Vragen | Subzy",
  description:
    "Vind antwoord op de meest gestelde vragen over energiebelasting teruggave, ISDE-subsidies, het aanvraagproces en onze kosten.",
  alternates: {
    canonical: "https://subzy.nl/faq",
  },
  openGraph: {
    title: "Veelgestelde Vragen | Subzy",
    description:
      "Vind antwoord op de meest gestelde vragen over energiebelasting teruggave, ISDE-subsidies en onze diensten.",
    url: "https://subzy.nl/faq",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: "Veelgestelde Vragen | Subzy",
    description:
      "Vind antwoord op de meest gestelde vragen over energiebelasting teruggave en subsidies.",
  },
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <main>
        <Suspense fallback={<div className="hero-bg py-16" />}>
          <FAQShell />
        </Suspense>
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
