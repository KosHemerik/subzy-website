/**
 * Eligibility Section - Explains who qualifies for tax refund
 */
export default function Eligibility() {
  const eligibilityItems = [
    {
      title: "Verhuurders",
      subtitle: "Particulier én zakelijk",
      description: "Verhuurt u één of meerdere woningen of bedrijfspanden via één elektriciteitsaansluiting? Dan betaalt u voor elke extra woning of unit onnodig te veel energiebelasting. Wij vorderen die te veel betaalde belasting terug, per pand en tot vijf jaar met terugwerkende kracht.",
    },
    {
      title: "VvE's",
      subtitle: "Verenigingen van Eigenaren",
      description: "Heeft uw VvE een gedeelde elektriciteitsaansluiting met meerdere appartementen of units? Dan heeft de VvE mogelijk recht op Teruggave Energiebelasting voor elk afzonderlijk WOZ-object. Wij regelen de aanvraag en jaarlijkse opvolging volledig voor u.",
    },
    {
      title: "Particulieren",
      subtitle: "Met meerdere WOZ-objecten",
      description: "Woont u in een pand met meerdere WOZ-objecten achter één aansluiting, zoals een woning met een aangebouwde studio, kantoorruimte of praktijkruimte? Dan kunt u als particulier ook in aanmerking komen voor teruggave energiebelasting.",
    },
  ];

  return (
    <section id="eligibility" className="py-20 bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase mb-3 block">
            VOOR WIE IS DIT?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Voor welke situaties geldt de Teruggave Energiebelasting?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            De regeling geldt voor iedereen die meerdere woningen of WOZ-objecten heeft achter één elektriciteitsaansluiting — particulier of zakelijk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div>
            <img
              src="/apartments.jpg"
              alt="Appartementencomplex – teruggave energiebelasting voor VvE en verhuurders"
              className="rounded-2xl shadow-lg object-cover object-top w-full h-[500px]"
            />
          </div>

          {/* Eligibility Items */}
          <div className="space-y-6">
            {eligibilityItems.map((item, index) => (
              <div key={index} className="flex bg-white p-5 rounded-xl shadow-sm">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white">
                    <i className="fa-solid fa-check" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-primary mb-0.5">{item.title}</h3>
                  <p className="text-gray-500 text-xs mb-1">{item.subtitle}</p>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
