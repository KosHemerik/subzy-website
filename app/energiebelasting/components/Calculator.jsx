"use client";

import { Button } from "@/components/ui";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ownershipOptions = [
  { value: "", label: "Selecteer..." },
  { value: "1", label: "1 jaar" },
  { value: "2", label: "2 jaar" },
  { value: "3", label: "3 jaar" },
  { value: "4", label: "4 jaar" },
  { value: "5", label: "5 jaar of langer" },
];

const wozOptions = [
  { value: "", label: "Selecteer..." },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10 of meer" },
];

/**
 * Custom Select Dropdown Component
 */
function CustomSelect({ options, value, onChange, placeholder = "Selecteer..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left flex items-center justify-between transition-all duration-200 ${
          isOpen 
            ? "border-secondary ring-4 ring-secondary/20" 
            : "border-gray-200 hover:border-gray-300"
        } ${value ? "text-gray-900" : "text-gray-500"}`}
      >
        <span className="font-medium">{displayLabel}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.filter(opt => opt.value !== "").map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                value === option.value
                  ? "bg-secondary text-white"
                  : "text-gray-700 hover:bg-background"
              }`}
            >
              <span className="font-medium">{option.label}</span>
              {value === option.value && (
                <i className="fa-solid fa-check text-sm" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Calculator Section - Estimate refund amount
 */
export default function Calculator() {
  const [ownership, setOwnership] = useState("");
  const [woz, setWoz] = useState("");

  const calculateRefund = () => {
    const ownershipVal = parseInt(ownership) || 0;
    const wozVal = parseInt(woz) || 0;

    if (ownershipVal > 0 && wozVal > 0) {
      const years = Math.min(ownershipVal, 5); // Max 5 jaar
      const extraUnits = wozVal - 1; // Aantal units - 1
      return years * extraUnits * 635.19;
    }
    return null;
  };

  const refundAmount = calculateRefund();
  const showResult = refundAmount !== null;

  return (
    <section id="calculator" className="py-20 bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Bereken uw mogelijk teruggaaf
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Explanation */}
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-2">
                  <span className="text-accent text-sm font-medium">Gratis rekenmodule</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-primary">
                  Wat kunt u terugkrijgen?
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Veel woningeigenaren betalen onnodig te veel energiebelasting — zonder dat ze het weten. 
                  Vul twee vragen in en zie direct een indicatie van uw mogelijke teruggave.
                </p>

                <div className="space-y-3 pt-4">
                  {["Vrijblijvend en gratis", "Resultaat binnen 30 seconden", "Geen registratie vereist"].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fa-solid fa-check text-green-600 text-xs" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-sm pt-4 border-t border-gray-100">
                  Dit is een indicatieve berekening. De exacte teruggave wordt vastgesteld na onze gratis analyse.
                </p>
              </div>

              {/* Right Column - Calculator Form */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-primary mb-6">Berekening</h3>

                <div className="space-y-6">
                  {/* Question 1 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                     Hoe lang heeft u al meerdere woningen achter één aansluiting? 
                    </label>
                    <CustomSelect
                      options={ownershipOptions}
                      value={ownership}
                      onChange={setOwnership}
                    />
                  </div>

                  {/* Question 2 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hoeveel woningen of units zitten achter één elektriciteitsaansluiting?
                    </label>
                    <CustomSelect
                      options={wozOptions}
                      value={woz}
                      onChange={setWoz}
                    />
                  </div>

                  {/* Calculated Result Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                     U kunt mogelijk terugkrijgen:
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium">
                      {showResult ? `${refundAmount?.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : "— €"}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/energiebelasting/aanvragen">
                    <Button
                      variant="primary"
                      className="w-full py-4 mt-4 rounded-xl text-lg font-semibold"
                    >
                      Vraag mijn gratis scan aan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
