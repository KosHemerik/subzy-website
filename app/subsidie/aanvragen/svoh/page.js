import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
import SvohWizard from "./SvohWizard";
import { RatingValue } from "@/components/ui";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://subzy.nl/subsidie/aanvragen/svoh",
      url: "https://subzy.nl/subsidie/aanvragen/svoh",
      name: "SVOH Subsidie Aanvragen | Verhuurders & VvE | Subzy",
      description:
        "Vraag uw SVOH-subsidie aan via Subzy. Voor verhuurders en VvE's die warmtepompen, isolatie of zonneboilers plaatsen in huurwoningen. No Cure No Pay.",
      inLanguage: "nl-NL",
      isPartOf: { "@id": "https://subzy.nl" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://subzy.nl",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Subsidie",
          item: "https://subzy.nl/subsidie",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "SVOH aanvragen",
          item: "https://subzy.nl/subsidie/aanvragen/svoh",
        },
      ],
    },
  ],
};

export const metadata = {
  title: "SVOH Subsidie Aanvragen | Verhuurders & VvE | Subzy",
  description:
    "Vraag uw SVOH-subsidie aan via Subzy. Voor verhuurders en VvE's die warmtepompen, isolatie of zonneboilers plaatsen in huurwoningen. No Cure No Pay.",
  alternates: {
    canonical: "https://subzy.nl/subsidie/aanvragen/svoh",
  },
  openGraph: {
    title: "SVOH Subsidie Aanvragen | Verhuurders & VvE | Subzy",
    description:
      "Vraag uw SVOH-subsidie aan via Subzy. Voor verhuurders en VvE's die warmtepompen, isolatie of zonneboilers plaatsen in huurwoningen. No Cure No Pay.",
    url: "https://subzy.nl/subsidie/aanvragen/svoh",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary",
    title: "SVOH Subsidie Aanvragen | Subzy",
    description:
      "Vraag uw SVOH-subsidie aan via Subzy. Voor verhuurders en VvE's die warmtepompen, isolatie of zonneboilers plaatsen in huurwoningen. No Cure No Pay.",
  },
};

export default function SvohAanvraagPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <main>
        {/* Page header */}
        <section className="hero-bg py-16 text-center curve-bottom overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/60 mb-2">SVOH subsidie aanvragen</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Start uw SVOH-aanvraag
            </h1>
            <p className="text-lg text-blue-100">
              Vul uw gegevens in en zie direct een indicatie van uw subsidie. Wij controleren uw aanvraag en dienen hem binnen 2 werkdagen in bij RVO.
            </p>

            {/* Trust bar in hero */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-secondary" />
                <span>No Cure No Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-secondary" />
                <span>Binnen 2 werkdagen ingediend</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-star text-yellow-400" />
                <span><RatingValue />/5 beoordeling</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wizard */}
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-gray-100 shadow-sm h-96 animate-pulse" />}>
            <SvohWizard regelingType="SVOH" />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
