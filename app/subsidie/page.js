import { Footer, Header, TopBar } from "@/components/layout";
import {
  RequiredDocuments,
  SubsidieAlgemeneFAQ,
  SubsidieCTA,
  SubsidieFAQ,
  SubsidieHero,
  SubsidiePricing,
  SubsidiesFilter,
  SubsidieTestimonials,
  SubsidieTimeline,
  WhatMeasures,
} from "./components";

export const metadata = {
  title: "Duurzaamheidssubsidie Aanvragen | ISDE & SVOH | No Cure No Pay | Subzy",
  description:
    "Vraag uw duurzaamheidssubsidie aan via Subzy. Warmtepomp, isolatie, zonneboiler — wij regelen de ISDE of SVOH aanvraag volledig voor u. No Cure No Pay, gemiddeld €1.200 terug.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Duurzaamheidssubsidie aanvragen",
  provider: {
    "@type": "Organization",
    name: "Subzy",
    url: "https://subzy.nl",
  },
  description: "Subzy regelt uw ISDE of SVOH subsidieaanvraag volledig. No Cure No Pay.",
  areaServed: "NL",
  serviceType: "Subsidieaanvraag",
};

export default function SubsidiePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <main>
        <SubsidieHero />
        {/* <SubsidiePricing /> */}
        <SubsidiesFilter />
        {/* <WhatMeasures /> */}
        {/* <RequiredDocuments /> */}
        <SubsidieTimeline />
        <SubsidieTestimonials />
        <SubsidieAlgemeneFAQ />
        {/* <SubsidieFAQ /> */}
        <SubsidieCTA />
      </main>
      <Footer />
    </>
  );
}
