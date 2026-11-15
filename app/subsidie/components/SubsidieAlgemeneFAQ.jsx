"use client";

import Link from "next/link";
import { useState } from "react";
import { FaqAnswer } from "@/components/ui";
import { faqSets, pickFaqs } from "@/lib/faq";

const faqItems = pickFaqs(faqSets.subsidie);

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none min-h-[60px]"
      >
        <span className="font-semibold text-primary pr-4">{question}</span>
        <i
          className={`fa-solid fa-chevron-down text-secondary transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div inert={!isOpen} className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed pt-4"><FaqAnswer answer={answer} /></p>
        </div>
      </div>
    </div>
  );
}

export default function SubsidieAlgemeneFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gray-50 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="animate-reveal text-center mb-12">
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
        <div className="animate-reveal-grid space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.id}
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
