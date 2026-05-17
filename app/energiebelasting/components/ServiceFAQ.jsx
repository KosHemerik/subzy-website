"use client";

import { Button } from "@/components/ui";
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
    answer: "Voor 2025 bedraagt de heffingskorting gemiddeld €635,19 inclusief btw per woning per jaar. Omdat u tot vijf jaar terug kunt vorderen, kan dit per woning oplopen tot meer dan €3.000.",
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
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="faq" className="py-20 bg-white w-full">
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
          <p className="text-gray-600 mb-6">
            Staat uw vraag er niet bij?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/faq">
              <Button variant="outline" size="lg">
                Bekijk alle veelgestelde vragen
              </Button>
            </Link>
            <Link href="/energiebelasting/aanvragen">
              <Button variant="primary" size="lg">
                Start de gratis scan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
