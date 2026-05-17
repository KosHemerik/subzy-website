const reasons = [
  {
    icon: "fa-check-circle",
    title: "No Cure No Pay",
    description: "Voor energiebelasting betaalt u alleen bij succes.",
  },
  {
    icon: "fa-couch",
    title: "100% Ontzorgd",
    description: "Wij regelen al het papierwerk en de communicatie.",
  },
  {
    icon: "fa-magnifying-glass",
    title: "Transparantie",
    description: "Volg uw aanvraag 24/7 via ons klantenportaal.",
  },
  {
    icon: "fa-clock-rotate-left",
    title: "Snelle Reactie",
    description: "Wij reageren altijd binnen 1 werkdag op uw vragen.",
  },
];

/**
 * Why Subzy Section
 * Trust signals and unique selling points
 */
export default function WhySubzy() {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Waarom kiezen voor Subzy?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div 
              key={reason.title}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <i className={`fa-solid ${reason.icon} text-4xl text-secondary mb-4`} />
              <h4 className="font-bold text-primary mb-2">{reason.title}</h4>
              <p className="text-sm text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
