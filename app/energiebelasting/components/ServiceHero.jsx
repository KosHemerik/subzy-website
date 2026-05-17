"use client";

import { Button } from "@/components/ui";

/**
 * Service Hero Section - Energy Tax Refund specific
 */
export default function ServiceHero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-bg relative pt-20 pb-32 curve-bottom w-full h-[600px] flex items-center overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center justify-center bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/20">
            <i className="fa-solid fa-bolt text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">Energiebelasting</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Krijg tot <span className="text-secondary">€1.500,-</span> terug van de Belastingdienst
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-200 mb-10 leading-relaxed">
Heeft u meerdere woningen, units of appartementen achter één elektriciteitsaansluiting? Grote kans dat u te veel energiebelasting betaalt. Wij regelen de teruggave volledig voor u.          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => scrollToSection("calculator")}
            >
             Check teruggave
            </Button>
            <button
              onClick={() => scrollToSection("hoe-het-werkt")}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-3.5 rounded-lg transition duration-300 text-lg w-full sm:w-auto"
            >
              Hoe werkt het?
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center">
              <i className="fa-solid fa-shield-halved text-secondary mr-2" />
              No Cure No Pay
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-clock text-secondary mr-2" />
          Binnen 2 werkdagen duidelijkheid
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-star text-yellow-400 mr-2" />
              4.8/5 Klantbeoordeling
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
