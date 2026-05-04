"use client";

import Link from "next/link";
import { useState } from "react";

const faqItems = [
  {
    question: "Wie komt in aanmerking voor duurzaamheidssubsidie?",
    answer:
      "Particulieren en bedrijven die investeren in een warmtepomp, zonneboiler, isolatie of ventilatiesysteem komen in aanmerking via de ISDE-regeling. Verhuurders en VvE's kunnen subsidie aanvragen via de SVOH-regeling. Wij bepalen automatisch welke regeling voor u van toepassing is.",
  },
  {
    question: "Hoeveel subsidie kan ik krijgen?",
    answer:
      "Dit hangt af van het type maatregel en het specifieke product. Voor een warmtepomp ontvangt u gemiddeld €2.400, voor isolatie gemiddeld €1.200 en voor een zonneboiler gemiddeld €900. Bij meerdere maatregelen kunt u combinatievoordeel ontvangen. Gebruik onze gratis subsidiescan voor een exacte berekening.",
  },
  {
    question: "Hoe lang duurt het aanvraagproces?",
    answer:
      "Na het indienen van uw aanvraag ontvangt u binnen 2–4 weken een beslissing van RVO. Wij dienen uw aanvraag in zodra alle documenten compleet zijn. De uitbetaling volgt kort daarna direct op uw rekening.",
  },
  {
    question: "Wat kost het als er geen subsidie wordt toegekend?",
    answer:
      "Niets. Wij werken volledig op basis van No Cure No Pay. U betaalt alleen ons honorarium van 20% excl. BTW als de subsidie daadwerkelijk wordt uitbetaald. Bij afwijzing zijn er geen kosten.",
  },
  {
    question: "Kan ik subsidie aanvragen voor meerdere maatregelen tegelijk?",
    answer:
      "Ja, en dat is juist voordelig. Bij meerdere maatregelen zoals isolatie én een warmtepomp ontvangt u combinatievoordeel — het subsidiebedrag per maatregel is hoger dan bij een enkele aanvraag. Selecteer alle maatregelen in onze subsidiescan voor het maximale bedrag.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none min-h-[60px]"
      >
        <span className="font-semibold text-primary pr-4">{question}</span>
        <i
          className={`fa-solid fa-chevron-down text-secondary transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SubsidieAlgemeneFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-[#2d4fd6] text-sm font-semibold tracking-wide uppercase">
              ❓ Veelgestelde vragen
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Alles wat u wil weten
          </h2>
          <p className="text-gray-500">
            Staat uw vraag er niet bij?{" "}
            <Link href="/contact" className="text-secondary hover:underline">
              Neem gerust contact op.
            </Link>
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
