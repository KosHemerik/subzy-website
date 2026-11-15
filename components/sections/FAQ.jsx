"use client";

import { useState } from "react";
import Link from "next/link";
import { FaqAnswer } from "@/components/ui";
import { faqSets, pickFaqs } from "@/lib/faq";

const faqs = pickFaqs(faqSets.home);

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
        inert={!isOpen}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[400px]" : "max-h-0"}`}
      >
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm"><FaqAnswer answer={answer} /></p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Veelgestelde vragen
          </h2>
          <p className="text-gray-600">
            Staat uw vraag er niet tussen? Neem dan contact met ons op.
          </p>
        </div>
        <div className="animate-reveal-grid space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
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
