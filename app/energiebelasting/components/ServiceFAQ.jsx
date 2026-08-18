"use client";

import Link from "next/link";
import { useState } from "react";

const faqItems = [
  {
    question: "Wat is teruggave energiebelasting precies?",
    answer: "De heffingskorting op energiebelasting wordt in de praktijk vaak maar een keer per aansluiting verrekend, terwijl u er per zelfstandig WOZ-object recht op heeft. Daardoor betalen veel eigenaren structureel te veel.",
  },
  {
    question: "Hoeveel kan ik terugkrijgen?",
    answer: "In 2025 is de heffingskorting €635,19 inclusief btw per extra woning per jaar. Omdat u tot 5 jaar terug kunt corrigeren, kan dit oplopen tot ruim €3.000 per woning.",
  },
  {
    question: "Hoe ver terug kan ik energiebelasting terugvragen?",
    answer: "U kunt het lopende jaar plus de 4 voorgaande kalenderjaren terugvragen.",
  },
  {
    question: "Waarom krijg ik die korting niet automatisch?",
    answer: "De energieleverancier ziet meestal maar één aansluiting (EAN) en past de korting daarom vaak maar één keer toe. De Belastingdienst corrigeert dit doorgaans alleen als u hier expliciet om verzoekt.",
  },
  {
    question: "Wat kost de dienst van Subzy?",
    answer: "Subzy werkt op basis van no cure, no pay. U betaalt 20% excl. btw over het bedrag dat wij daadwerkelijk voor u terugkrijgen.",
  },
  {
    question: "Hoe lang duurt het voordat ik het geld ontvang?",
    answer: "Gemiddeld duurt het circa 6 weken voordat u de teruggave ontvangt.",
  },
];

/**
 * FAQ Accordion Item
 */
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-primary">{question}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-gray-600 text-sm">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Service FAQ Section - Energy Tax specific questions
 */
export default function ServiceFAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 lg:py-24 bg-background w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="animate-reveal text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Veelgestelde vragen</h2>
          <p className="text-gray-600">
            Alles wat u moet weten over de teruggave energiebelasting.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="animate-reveal-grid space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm mb-4">Nog vragen? Of direct aan de slag?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/energiebelasting/aanvragen"
              className="inline-flex items-center font-semibold transition duration-300 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-primary px-5 py-2.5 text-sm"
            >
              Vraag gratis scan aan
              <i className="fa-solid fa-arrow-right ml-2" />
            </Link>
            <Link
              href="/faq?category=energiebelasting"
              className="text-secondary text-sm font-medium hover:text-primary transition underline decoration-secondary underline-offset-4"
            >
              Bekijk alle vragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
