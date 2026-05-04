"use client";

/**
 * Why Us Section - Advantages of using Subzy
 */
export default function Pricing() {
  const advantages = [
    {
      icon: "fa-solid fa-shield-check",
      iconBg: "bg-secondary",
      title: "No Cure No Pay",
      description: "U betaalt alleen bij succes. Geen risico, geen verrassingen.",
    },
    {
      icon: "fa-solid fa-rocket",
      iconBg: "bg-accent",
      title: "Snel geregeld",
      description: "Binnen 5 dagen volledig afgehandeld door onze specialisten.",
    },
    {
      icon: "fa-solid fa-user-tie",
      iconBg: "bg-primary",
      title: "Expertise",
      description: "Jarenlange ervaring met energiebelasting en de Belastingdienst.",
    },
    {
      icon: "fa-solid fa-sparkles",
      iconBg: "bg-secondary",
      title: "Geen gedoe",
      description: "Wij regelen alles voor u, van begin tot eind.",
    },
  ];

  const highlights = [
    {
      icon: "fa-solid fa-trophy",
      title: "100% succesverhouding",
      description: "Wij hebben meer dan 3.500 klanten geholpen om hun teruggave te krijgen.",
    },
    {
      icon: "fa-solid fa-hand-holding-dollar",
      title: "Geen risico voor u",
      description: "U betaalt alleen als de teruggave succesvol is. Geen verborgen kosten.",
    },
  ];

  return (
    <section id="waarom-ons" className="py-20 bg-white w-full border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
            <i className="fa-solid fa-star text-secondary mr-2 text-sm" />
            <span className="text-accent text-sm font-medium">Onze voordelen</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Waarom via Subzy regelen?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            U kunt het zelf proberen, maar wij maken het makkelijker, sneller en succesvoller.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, index) => (
            <div 
              key={index} 
              className="bg-background p-8 rounded-2xl border border-blue-100 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 text-center group"
            >
              <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-lg shadow-${item.iconBg}/30 group-hover:scale-110 transition-transform duration-300`}>
                <i className={item.icon} />
              </div>
              <h4 className="font-bold text-primary mb-3 text-lg">{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mt-12 bg-gradient-to-r from-primary to-[#152A4A] p-10 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <i className={item.icon} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2 text-lg">{item.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
