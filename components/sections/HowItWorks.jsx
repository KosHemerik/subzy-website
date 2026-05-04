const steps = [
  {
    number: 1,
    title: "Gratis check",
    description: "Vul je gegevens in en ontdek direct of je in aanmerking komt.",
  },
  {
    number: 2,
    title: "Documenten",
    description: "Upload eenvoudig de benodigde documenten in ons veilige portaal.",
  },
  {
    number: 3,
    title: "Wij vragen aan",
    description: "Onze experts dienen de aanvraag foutloos in bij de instanties.",
  },
  {
    number: 4,
    title: "Uitbetaling",
    description: "Ontvang het bedrag direct op je rekening van de belastingdienst.",
  },
];

/**
 * Step component
 */
function Step({ number, title, description }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-white border-4 border-background rounded-full flex items-center justify-center text-2xl font-bold text-secondary mb-6 shadow-sm">
        {number}
      </div>
      <h4 className="text-xl font-bold text-primary mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

/**
 * How it works section
 */
export default function HowItWorks() {
  return (
    <section className="py-20 bg-white max-w-[1440px] mx-auto border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Hoe werkt het?</h2>
          <p className="text-gray-600 text-lg">
            In 4 simpele stappen jouw subsidie of teruggave geregeld
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-1/8 right-1/8 h-0.5 bg-gray-200 z-0" />
          
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
