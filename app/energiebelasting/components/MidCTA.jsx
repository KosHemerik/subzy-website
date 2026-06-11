"use client";

import Link from "next/link";

/**
 * Mid-page CTA Banner - Light style
 */
export default function MidCTA() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  const trustItems = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "No Cure No Pay",
      description: "U betaalt alleen bij succes. Geen risico, geen verrassingen.",
    },
    {
      icon: "fa-solid fa-rocket",
      title: "Snel geregeld",
      description: "Binnen 2 werkdagen duidelijkheid van onze specialisten.",
    },
    {
      icon: "fa-solid fa-handshake",
      title: "Geen gedoe",
      description: "Wij regelen alles voor u, van begin tot eind.",
    },
    {
      icon: "fa-solid fa-user-tie",
      title: "Expertise",
      description: "Jarenlange ervaring met energiebelasting en de Belastingdienst",
    },
  ];

  return (
    <section id="mid-cta" className="py-16 bg-white w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center bg-background text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <i className="fa-solid fa-star mr-2" />
          Onze voordelen
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          Waarom via Subzy regelen?
        </h2>
        <p className="text-gray-600 mb-10">
          U kunt het zelf proberen, maar wij maken het makkelijker, sneller en succesvoller.
        </p>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-3 text-accent transition-transform duration-300 group-hover:scale-110">
                <i className={item.icon} />
              </div>
              <p className="font-semibold text-primary">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/energiebelasting/aanvragen"
          className="group font-bold transition duration-300 rounded-lg inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary shadow-lg px-6 py-3"
        >
          Vraag gratis scan aan
          <i className="fa-solid fa-arrow-right ml-2 cta-arrow-bounce" />
        </Link>
        <p className="text-gray-400 text-sm mt-4">
          Gratis check • Geen verplichtingen
        </p>
      </div>
    </section>
  );
}
