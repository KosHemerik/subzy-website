"use client";

import { useState } from "react";
import Link from "next/link";

const faqItems = [
  {
    question: "Binnen welke termijn moet ik de subsidie aanvragen?",
    answer:
      "U moet de ISDE-subsidie aanvragen binnen 12 maanden na de datum op de factuur van de laatste maatregel. Wij adviseren dit zo snel mogelijk te doen om teleurstelling te voorkomen.",
  },
  {
    question: "Kom ik in aanmerking als huurder?",
    answer:
      "Nee, de ISDE-subsidie is alleen beschikbaar voor eigenaar-bewoners en verhuurders. Als huurder kunt u helaas geen gebruik maken van deze regeling.",
  },
  {
    question: "Hoe hoog is de subsidie precies?",
    answer:
      "De hoogte van de subsidie is afhankelijk van het type maatregel, het materiaal en de hoeveelheid. Wij berekenen het exacte bedrag na de gratis haalbaarheidscheck.",
  },
  {
    question: "Kan ik subsidie aanvragen als de werkzaamheden al zijn uitgevoerd?",
    answer:
      "Ja, dat is zelfs verplicht. De ISDE-subsidie vraagt u aan nádat de werkzaamheden zijn uitgevoerd en de facturen zijn betaald.",
  },
  {
    question: "Hoe lang duurt het traject?",
    answer:
      "Gemiddeld duurt het 2 tot 4 weken van intake tot uitbetaling. De doorlooptijd is mede afhankelijk van de snelheid waarmee u de benodigde documenten aanlevert.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-primary text-left">{question}</span>
        <i
          className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-gray-400`}
        />
      </button>
      {isOpen && (
        <div className="p-5 bg-white border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SubsidieFAQ() {
  return (
    <section id="faq" className="py-20 bg-white w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Veelgestelde vragen</h2>
          <p className="text-gray-600">Alles wat u moet weten over de ISDE-subsidie.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Staat uw vraag er niet bij?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/faq"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-bold px-8 py-3 rounded-lg transition duration-300"
            >
              Bekijk alle veelgestelde vragen
            </Link>
            <Link
              href="/subsidie/aanvragen"
              className="bg-secondary hover:bg-accent text-white font-bold px-8 py-3 rounded-lg transition duration-300"
            >
              Start de gratis check
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
