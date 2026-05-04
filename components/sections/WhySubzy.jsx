const reasons = [
  {
    icon: "fa-solid fa-hand-holding-dollar",
    title: "No Cure, No Pay",
    description: "Je betaalt ons pas als de aanvraag succesvol is afgerond. Geen verborgen kosten, 100% transparant.",
  },
  {
    icon: "fa-solid fa-stopwatch",
    title: "Snel geregeld",
    description: "Dankzij ons efficiënte proces dienen we je aanvraag binnen 48 uur na ontvangst van documenten in.",
  },
  {
    icon: "fa-solid fa-user-shield",
    title: "Expertise",
    description: "Onze specialisten kennen alle regels en uitzonderingen, zodat jij de maximale vergoeding krijgt.",
  },
];

/**
 * Reason card component
 */
function ReasonCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-[12px] shadow-sm text-center">
      <div className="w-16 h-16 mx-auto bg-surface rounded-full flex items-center justify-center text-secondary mb-6">
        <i className={`${icon} text-2xl`} />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Why Subzy section
 */
export default function WhySubzy() {
  return (
    <section className="py-20 bg-background max-w-[1440px] mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Waarom kiezen voor Subzy?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reasons.map((reason) => (
            <ReasonCard key={reason.title} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
