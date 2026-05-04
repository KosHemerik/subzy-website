"use client";

/**
 * Target Audience Section
 * "Voor wie is deze dienst?"
 */
export default function TargetAudience() {
  const audiences = [
    {
      icon: "fa-solid fa-key",
      title: "Verhuurders",
      subtitle: "Particulier én zakelijk",
      description:
        "Verhuurt u één of meerdere woningen of bedrijfspanden via één elektriciteitsaansluiting? Dan betaalt u voor elke extra woning of unit onnodig te veel energiebelasting. Wij vorderen die te veel betaalde belasting terug, per pand en tot vijf jaar met terugwerkende kracht.",
    },
    {
      icon: "fa-solid fa-building",
      title: "VvE's",
      subtitle: "Verenigingen van Eigenaren",
      description:
        "Heeft uw VvE een gedeelde elektriciteitsaansluiting met meerdere appartementen of units? Dan heeft de VvE mogelijk recht op Teruggave Energiebelasting voor elk afzonderlijk WOZ-object. Wij regelen de aanvraag en jaarlijkse opvolging volledig voor u.",
    },
    {
      icon: "fa-solid fa-house",
      title: "Particulieren",
      subtitle: "Met meerdere WOZ-objecten",
      description:
        "Woont u in een pand met meerdere WOZ-objecten achter één aansluiting, zoals een woning met een aangebouwde studio, kantoorruimte of praktijkruimte? Dan kunt u als particulier ook in aanmerking komen voor teruggave energiebelasting.",
    },
  ];

  return (
    <section id="voor-wie" className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Voor wie is deze dienst?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Of u nu particulier bent of een bedrijf heeft, wij helpen u met het
            terugvragen van energiebelasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="bg-background p-8 rounded-2xl border border-blue-100"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-5 text-white text-xl">
                <i className={audience.icon} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">
                {audience.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{audience.subtitle}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
