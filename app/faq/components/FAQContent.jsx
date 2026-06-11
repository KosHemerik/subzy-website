"use client";

import { COMPANY_INFO } from "@/lib/constants";
import { useMemo, useState } from "react";
import { faqCategories, faqData } from "../faqData";

function FAQItem({ question, answer, isOpen, onToggle, itemId }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        id={`btn-${itemId}`}
        className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${itemId}`}
      >
        <span className="font-semibold text-primary">{question}</span>
        <i
          aria-hidden="true"
          className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={`panel-${itemId}`}
        role="region"
        aria-labelledby={`btn-${itemId}`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[800px]" : "max-h-0"
        }`}
      >
        <div className="p-5 bg-white border-t border-gray-100 text-gray-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

function CategoryTab({ category, isActive, onClick }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`w-full text-left px-6 py-4 rounded-xl font-medium transition border ${
        isActive
          ? "bg-secondary text-white border-secondary shadow-sm"
          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      <i aria-hidden="true" className={`${category.icon} w-6 text-center mr-2`} />
      {category.label}
    </button>
  );
}

function TrustBlock() {
  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center mb-4" aria-hidden="true">
        <div className="flex space-x-1 text-yellow-400 text-xl">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fa-solid fa-star" aria-hidden="true" />
          ))}
        </div>
      </div>
      <p className="text-center font-bold text-primary text-3xl leading-none mb-1">{COMPANY_INFO.rating}/5</p>
      <p className="text-center text-sm text-gray-600 mb-4">Klantreviews</p>
      <hr className="border-gray-200 mb-4" />
      <div className="flex items-center text-sm text-gray-700 mb-2">
        <i aria-hidden="true" className="fa-solid fa-check text-secondary mr-2" />
        Wij reageren binnen 1 werkdag
      </div>
      <div className="flex items-center text-sm text-gray-700">
        <i aria-hidden="true" className="fa-solid fa-check text-secondary mr-2" />
        100% Ontzorgd
      </div>
    </div>
  );
}

export default function FAQContent({ searchQuery = "", initialCategory = "algemeen" }) {
  const [activeCategory, setActiveCategory] = useState(
    faqData[initialCategory] ? initialCategory : "algemeen"
  );
  const [openIndex, setOpenIndex] = useState(null);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { [activeCategory]: faqData[activeCategory] };
    }

    const query = searchQuery.toLowerCase();
    const results = {};

    Object.entries(faqData).forEach(([categoryId, categoryData]) => {
      const filteredQuestions = categoryData.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      );

      if (filteredQuestions.length > 0) {
        results[categoryId] = { ...categoryData, questions: filteredQuestions };
      }
    });

    return results;
  }, [searchQuery, activeCategory]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 space-y-2">
            <div role="tablist" aria-label="FAQ categorieën" className="space-y-2">
              {faqCategories.map((category) => (
                <CategoryTab
                  key={category.id}
                  category={category}
                  isActive={!isSearching && activeCategory === category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenIndex(null);
                  }}
                />
              ))}
            </div>
            <TrustBlock />
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="lg:w-2/3">
          {isSearching ? (
            Object.keys(filteredData).length > 0 ? (
              Object.entries(filteredData).map(([categoryId, categoryData]) => (
                <div key={categoryId} className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    {categoryData.title}
                  </h2>
                  <div className="space-y-4">
                    {categoryData.questions.map((faq, index) => (
                      <FAQItem
                        key={`${categoryId}-${index}`}
                        itemId={`${categoryId}-${index}`}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === `${categoryId}-${index}`}
                        onToggle={() =>
                          setOpenIndex(
                            openIndex === `${categoryId}-${index}`
                              ? null
                              : `${categoryId}-${index}`
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <i aria-hidden="true" className="fa-solid fa-magnifying-glass text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600 text-lg">
                  Geen resultaten gevonden voor &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-gray-500 mt-2">
                  Probeer een andere zoekterm of bekijk de categorieën
                </p>
              </div>
            )
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                {faqData[activeCategory].title}
              </h2>
              <div className="space-y-4">
                {faqData[activeCategory].questions.map((faq, index) => (
                  <FAQItem
                    key={index}
                    itemId={`${activeCategory}-${index}`}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onToggle={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
