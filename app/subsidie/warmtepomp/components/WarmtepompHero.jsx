import { RatingValue } from "@/components/ui";
import { ISDE_2026, SUBZY_TARIEF } from "../data";

const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const kerncijfers = [
  { label: "Startbedrag", value: fmt.format(ISDE_2026.startbedrag), sub: "eerste lucht-waterwarmtepomp" },
  { label: "Per kW vermogen", value: `+ ${fmt.format(ISDE_2026.perKw)}`, sub: "vanaf de eerste kW" },
  { label: "Label A+++", value: `+ ${fmt.format(ISDE_2026.labelBonus)}`, sub: "energielabelbonus" },
  { label: "Altijd minimaal", value: fmt.format(ISDE_2026.minimum), sub: "per (hybride) warmtepomp" },
];

export default function WarmtepompHero() {
  return (
    <section className="hero-bg relative pt-20 pb-24 curve-bottom w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <i className="fa-solid fa-fire-flame-curved text-secondary mr-2" />
              <span className="text-white text-sm font-medium">Warmtepomp subsidie 2026</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance">
              Subsidie voor uw warmtepomp in 2026
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Een lucht-waterwarmtepomp van 4 kW levert in 2026 al snel {fmt.format(2125)} subsidie op. In onze
              scan ziet u direct om welk bedrag het gaat. Daarna controleren wij uw aanvraag en dienen hem binnen
              2 werkdagen in bij RVO. Voor een vast tarief van {fmt.format(SUBZY_TARIEF.basis)}, en alleen als de
              subsidie wordt toegekend.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-10">
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-secondary mr-2" />
                No Cure No Pay
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-bolt text-secondary mr-2" />
                Direct een indicatie
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-star text-yellow-400 mr-2" />
                <RatingValue />/5 Klantbeoordeling
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#aanvragen"
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-7 py-3 rounded-xl transition duration-200 shadow-lg"
              >
                Start mijn aanvraag <i className="fa-solid fa-arrow-down ml-2" />
              </a>
              <a
                href="#berekenen"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3 rounded-xl transition duration-200"
              >
                Bereken mijn bedrag
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full lg:ml-auto">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-euro-sign text-green-600 text-sm" />
              </div>
              <h2 className="text-base font-bold text-primary">ISDE-bedragen 2026</h2>
            </div>

            <div className="space-y-1">
              {kerncijfers.map((k) => (
                <div key={k.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{k.label}</p>
                    <p className="text-xs text-gray-400">{k.sub}</p>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{k.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <i className="fa-solid fa-circle-info text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-gray-700">
                Rekenvoorbeeld: 4 kW met label A+++ = {fmt.format(ISDE_2026.startbedrag)} + 4 × {fmt.format(ISDE_2026.perKw)} + {fmt.format(ISDE_2026.labelBonus)} = <strong>{fmt.format(2125)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
