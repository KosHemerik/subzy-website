"use client";

import { useState } from "react";
import { ISDE_2026 } from "../data";

const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// Indicatie voor een lucht-waterwarmtepomp (ook hybride) volgens de ISDE-rekenregel 2026
function berekenIndicatie({ kw, aPlusPlusPlus, eerste }) {
  const bedrag = eerste
    ? ISDE_2026.startbedrag + kw * ISDE_2026.perKw + (aPlusPlusPlus ? ISDE_2026.labelBonus : 0)
    : kw * ISDE_2026.perKw;
  return Math.max(bedrag, ISDE_2026.minimum);
}

function Keuze({ label, value, onChange, options }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              value === o.value
                ? "bg-secondary text-white border-secondary"
                : "bg-white text-gray-500 border-gray-300 hover:border-secondary hover:text-secondary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SubsidieCalculator() {
  const [kw, setKw] = useState(4);
  const [aPlusPlusPlus, setAPlusPlusPlus] = useState(true);
  const [eerste, setEerste] = useState(true);

  const bedrag = berekenIndicatie({ kw, aPlusPlusPlus, eerste });

  return (
    <section id="berekenen" className="py-16 md:py-20 lg:py-24 bg-white w-full scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Hoeveel subsidie krijgt u?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bereken een indicatie voor een lucht-waterwarmtepomp of hybride warmtepomp. Het vermogen (kW) en
            energielabel vindt u op de offerte of factuur van uw installateur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="bg-surface rounded-2xl border border-gray-100 p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="kw" className="text-sm font-medium text-gray-700">Vermogen van de warmtepomp</label>
                <span className="text-sm font-bold text-primary">{kw} kW</span>
              </div>
              <input
                id="kw"
                type="range"
                min={1}
                max={20}
                step={1}
                value={kw}
                onChange={(e) => setKw(Number(e.target.value))}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 kW</span>
                <span>20 kW</span>
              </div>
            </div>

            <Keuze
              label="Energielabel"
              value={aPlusPlusPlus}
              onChange={setAPlusPlusPlus}
              options={[{ value: true, label: "A+++" }, { value: false, label: "A++" }]}
            />

            <Keuze
              label="Is dit uw eerste lucht-waterwarmtepomp op dit adres?"
              value={eerste}
              onChange={setEerste}
              options={[{ value: true, label: "Ja, de eerste" }, { value: false, label: "Nee, een tweede of volgende" }]}
            />
          </div>

          <div className="bg-primary rounded-2xl p-6 text-white flex flex-col">
            <p className="text-blue-200 text-sm mb-1">Indicatie subsidie</p>
            <p className="text-4xl font-bold mb-4" aria-live="polite">{fmt.format(bedrag)}</p>
            <div className="text-sm text-blue-100 space-y-1 mb-6">
              {eerste ? (
                <>
                  <p>Startbedrag: {fmt.format(ISDE_2026.startbedrag)}</p>
                  <p>{kw} × {fmt.format(ISDE_2026.perKw)} per kW: {fmt.format(kw * ISDE_2026.perKw)}</p>
                  {aPlusPlusPlus && <p>Labelbonus A+++: {fmt.format(ISDE_2026.labelBonus)}</p>}
                </>
              ) : (
                <p>{kw} × {fmt.format(ISDE_2026.perKw)} per kW (geen startbedrag en geen labelbonus)</p>
              )}
            </div>
            <a
              href="#aanvragen"
              className="mt-auto inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-6 py-3 rounded-xl transition duration-200"
            >
              Vraag dit bedrag aan <i className="fa-solid fa-arrow-down ml-2" />
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 max-w-3xl">
          Dit is een indicatie op basis van de ISDE-rekenregel 2026. RVO rekent met een eigen subsidiabel vermogen, dat
          kan afwijken van het vermogen van de fabrikant. Het exacte bedrag staat per model op de meldcodelijst van RVO;
          dat zoeken wij voor u op. Voor grond-water- en water-waterwarmtepompen en warmtepompboilers geldt een ander
          bedrag per model.
        </p>
      </div>
    </section>
  );
}
