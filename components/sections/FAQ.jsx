"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Wat kost de service van Subzy?",
    answer: "Wij werken op basis van No Cure No Pay. Voor teruggave energiebelasting rekenen wij 20% excl. BTW over het teruggekregen bedrag. Voor ISDE-subsidie rekenen wij 10% excl. BTW. U betaalt pas achteraf bij succes.",
  },
  {
    question: "Hoelang duurt een aanvraag gemiddeld?",
    answer: "Zodra wij alle documenten compleet hebben, dienen wij de aanvraag binnen 48 uur in. De belastingdienst of RVO doet er vervolgens gemiddeld 6 tot 8 weken over om de aanvraag te verwerken en uit te betalen.",
  },
  {
    question: "Welke documenten heb ik nodig?",
    answer: "Dit verschilt per aanvraag. Voor energiebelasting hebben we jaarrekeningen van uw energieleverancier nodig. Voor ISDE subsidie vragen we om facturen en betaalbewijzen van de installateur. In ons portaal ziet u precies wat er nodig is.",
  },
  {
    question: "Is mijn data veilig bij jullie?",
    answer: "Ja, 100%. Ons klantportaal is beveiligd volgens de hoogste standaarden en wij zijn AVG-compliant. Uw documenten worden uitsluitend gebruikt voor de aanvraag en nooit gedeeld met derden.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle, itemId }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden">
      <button
        id={`btn-${itemId}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${itemId}`}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        <span className="font-semibold text-primary">{question}</span>
        <i
          aria-hidden="true"
          className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={`panel-${itemId}`}
        role="region"
        aria-labelledby={`btn-${itemId}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[400px]" : "max-h-0"}`}
      >
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Veelgestelde vragen
          </h2>
          <p className="text-gray-600">
            Staat uw vraag er niet tussen? Neem dan contact met ons op.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              itemId={`home-${index}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
        <div className="text-center mt-8">
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
