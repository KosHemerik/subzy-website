import { Footer, Header, TopBar } from "@/components/layout";
import {
  CTABanner,
  FAQ,
  Hero,
  Services,
  Testimonials,
  TrustBar,
} from "@/components/sections";

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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Wat kost de service van Subzy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wij werken op basis van No Cure No Pay. Voor teruggave energiebelasting rekenen wij 20% excl. BTW over het teruggekregen bedrag. Voor ISDE-subsidie rekenen wij 10% excl. BTW. U betaalt pas achteraf bij succes.",
          },
        },
        {
          "@type": "Question",
          name: "Hoelang duurt een aanvraag gemiddeld?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zodra wij alle documenten compleet hebben, dienen wij de aanvraag binnen 48 uur in. De belastingdienst of RVO doet er vervolgens gemiddeld 6 tot 8 weken over om de aanvraag te verwerken en uit te betalen.",
          },
        },
        {
          "@type": "Question",
          name: "Welke documenten heb ik nodig?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dit verschilt per aanvraag. Voor energiebelasting hebben we jaarrekeningen van uw energieleverancier nodig. Voor ISDE subsidie vragen we om facturen en betaalbewijzen van de installateur. In ons portaal ziet u precies wat er nodig is.",
          },
        },
        {
          "@type": "Question",
          name: "Is mijn data veilig bij jullie?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja, 100%. Ons klantportaal is beveiligd volgens de hoogste standaarden en wij zijn AVG-compliant. Uw documenten worden uitsluitend gebruikt voor de aanvraag en nooit gedeeld met derden.",
          },
        },
      ],
    },
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
