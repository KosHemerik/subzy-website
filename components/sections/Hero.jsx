"use client";

import Link from "next/link";

const trustIndicators = [
  { icon: "fa-shield-halved", text: "No Cure No Pay", color: "text-yellow-400" },
  { icon: "fa-circle-check", text: "Binnen 5 dagen geregeld", color: "text-green-400" },
  { icon: "fa-star", text: "4.8/5 Klantbeoordeling", color: "text-yellow-400" },
  { icon: "fa-euro-sign", text: "Gemiddeld €850 terug", color: "text-green-400" },
];

/**
 * Hero section with main headline and CTA buttons
 */
export default function Hero() {
  return (
    <section className="hero-bg relative pt-20 pb-32 curve-bottom min-h-[700px] overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Hero Text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white">
          Energiebelasting terugvragen of subsidie aanvragen?
        </h1>
        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-6">
          Wij regelen het volledig voor u.
        </h2> */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Veel verhuurders, VvE's en particulieren betalen onnodig te veel energiebelasting of laten verduurzamingssubsidie liggen. Subzy regelt de teruggave of subsidie aanvraag volledig voor u, op basis van No Cure No Pay.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Link 
            href="/energiebelasting"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-6 py-3 rounded-lg transition duration-300 shadow-lg"
          >
            Energiebelasting terugvragen <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
          <Link 
            href="/subsidie"
            className="inline-flex items-center bg-primary/50 hover:bg-primary/70 border-2 border-white/20 text-white font-bold px-6 py-3 rounded-lg transition duration-300"
          >
            Subsidie aanvragen <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-white/80">
          {trustIndicators.map((indicator, index) => (
            <div key={indicator.text} className="flex items-center">
              <i className={`fa-solid ${indicator.icon} ${indicator.color} mr-2`} />
              <span className="text-sm">{indicator.text}</span>
              {index < trustIndicators.length - 1 && (
                <span className="hidden sm:inline ml-6 text-white/30">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
