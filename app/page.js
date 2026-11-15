import { Footer, Header, TopBar } from "@/components/layout";
import {
  CTABanner,
  FAQ,
  Hero,
  Services,
  Testimonials,
  TrustBar,
} from "@/components/sections";
import { faqPageSchema, faqSets, pickFaqs } from "@/lib/faq";

export const metadata = {
  title: "Energiebelasting Terugvragen & Subsidie Aanvragen | Subzy",
  description:
    "Subzy regelt uw energiebelasting teruggave en duurzaamheidssubsidie volledig voor u. No Cure No Pay. Gratis scan binnen 2 werkdagen. Al 1.400+ aanvragen succesvol afgerond.",
  alternates: {
    canonical: "https://subzy.nl",
  },
  openGraph: {
    title: "Energiebelasting Terugvragen & Subsidie Aanvragen | Subzy",
    description:
      "Subzy regelt uw energiebelasting teruggave en duurzaamheidssubsidie volledig voor u. No Cure No Pay. Gratis scan binnen 2 werkdagen.",
    url: "https://subzy.nl",
    type: "website",
    siteName: "Subzy",
    locale: "nl_NL",
    images: [
      {
        url: "https://subzy.nl/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subzy — Energiebelasting terugvragen en subsidie aanvragen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Energiebelasting Terugvragen & Subsidie Aanvragen | Subzy",
    description:
      "No Cure No Pay. Gratis scan binnen 2 werkdagen. Al 1.400+ aanvragen succesvol afgerond.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://subzy.nl/#organization",
      name: "Subzy",
      url: "https://subzy.nl",
      logo: {
        "@type": "ImageObject",
        url: "https://subzy.nl/subzy_logo_transparant.png",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Burggravenlaan 179",
        postalCode: "2313 HR",
        addressLocality: "Leiden",
        addressCountry: "NL",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+31-71-203-24-05",
        contactType: "customer service",
        availableLanguage: "Dutch",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://subzy.nl/#website",
      url: "https://subzy.nl",
      name: "Subzy",
      publisher: { "@id": "https://subzy.nl/#organization" },
      inLanguage: "nl-NL",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://subzy.nl/faq?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://subzy.nl/#webpage",
      url: "https://subzy.nl",
      name: "Energiebelasting Terugvragen & Subsidie Aanvragen | Subzy",
      isPartOf: { "@id": "https://subzy.nl/#website" },
      about: { "@id": "https://subzy.nl/#organization" },
      inLanguage: "nl-NL",
    },
    faqPageSchema(pickFaqs(faqSets.home)),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
