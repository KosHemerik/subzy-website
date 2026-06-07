"use client";

import Link from "next/link";
import { useState } from "react";

const faqItems = [
  {
    question: "Wat is de Teruggave Energiebelasting?",
    answer: "De Teruggave Energiebelasting is een wettelijke regeling waarmee eigenaren van panden met meerdere woningen of WOZ-objecten achter één elektriciteitsaansluiting de te veel betaalde energiebelasting kunnen terugvorderen bij de Belastingdienst.",
  },
  {
    question: "Hoe weet ik of ik in aanmerking kom?",
    answer: "Als u meerdere woningen, appartementen of WOZ-objecten heeft die aangesloten zijn op één elektriciteitsaansluiting, komt u mogelijk in aanmerking. Vraag onze vrijblijvende scan aan en wij beoordelen het voor u.",
  },
  {
    question: "Hoeveel kan ik terugkrijgen?",
    answer: "Het bedrag verschilt per jaar en per aansluiting. Gemiddeld loopt de teruggave per extra woning op tot enkele honderden euro's per jaar. Omdat u tot vijf jaar terug kunt vorderen, kan het totaalbedrag aanzienlijk oplopen. Wij berekenen het exacte bedrag voor u na de scan.",
  },
  {
    question: "Wat kost het?",
    answer: "Wij werken uitsluitend op basis van No cure, No pay. U betaalt alleen een percentage van de daadwerkelijk ontvangen teruggave. Als wij niets terugkrijgen, betaalt u niets.",
  },
  {
    question: "Is dit legaal?",
    answer: "Ja, de Teruggave Energiebelasting is een officiële wettelijke regeling van de Nederlandse overheid. Wij dienen de aanvraag namens u in bij de Belastingdienst via de daarvoor bestemde procedure.",
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
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-primary">{question}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Service FAQ Section - Energy Tax specific questions
 */
export default function ServiceFAQ() {
  return (
    <section id="faq" className="py-20 bg-background w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Veelgestelde vragen</h2>
          <p className="text-gray-600">
            Alles wat u moet weten over de teruggave energiebelasting.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        {/* Link to full FAQ */}
        <div className="mt-12 text-center">
          <Link
            href="/faq"
            className="text-secondary font-medium hover:text-primary transition underline decoration-secondary underline-offset-4"
          >
            Bekijk alle veelgestelde vragen
          </Link>
        </div>
      </div>
    </section>
  );
}
