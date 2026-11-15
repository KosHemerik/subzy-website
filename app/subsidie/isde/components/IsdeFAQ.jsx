"use client";

import Link from "next/link";
import { useState } from "react";
import { FaqAnswer } from "@/components/ui";
import { faqSets, pickFaqs } from "@/lib/faq";

const faqItems = pickFaqs(faqSets.isde);

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-primary pr-4">{question}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div inert={!isOpen} className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed"><FaqAnswer answer={answer} /></p>
        </div>
      </div>
    </div>
  );
}

export default function IsdeFAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 lg:py-24 bg-white w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Veelgestelde vragen over ISDE</h2>
          <p className="text-gray-600">
            Alles wat u moet weten over de ISDE subsidie en hoe Subzy u helpt.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <FAQItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Staat uw vraag er niet bij?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition duration-200"
            >
              Neem contact op
            </Link>
            <Link
              href="/subsidie#subsidies"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-6 py-3 rounded-xl transition duration-200 shadow"
            >
              Start gratis subsidiecheck <i className="fa-solid fa-arrow-right ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
