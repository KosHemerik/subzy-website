"use client";

/**
 * Problem Awareness Section
 * "Wist u dat u mogelijk te veel energiebelasting betaalt?"
 */
export default function ProblemAwareness() {
  const stats = [
    {
      value: "2 dagen",
      description: "En u weet waar u aan toe bent",
    },
    {
      value: "€1.867",
      description: "Gemiddelde teruggave per klant",
    },
    {
      value: "0% risico",
      description: "Alleen betalen bij resultaat",
    },
  ];

  return (
    <section id="problem" className="-mt-16 pt-32 pb-20 bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            U laat waarschijnlijk al jaren geld liggen
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Heeft u meerdere woningen of units achter één elektriciteitsmeter? Dan past uw energieleverancier de heffingskorting maar één keer toe — terwijl u er voor elke zelfstandige woning recht op heeft. Dat scheelt al snel €635 per woning per jaar, tot vijf jaar terug. De Belastingdienst corrigeert dit alleen op verzoek, en vrijwel niemand kent de regeling.
          </p>
        </div>

        <div className="mt-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-8 sm:gap-6 text-gray-700">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center px-2 sm:px-0 min-w-[180px]">
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-secondary leading-none mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 leading-snug max-w-[11rem] mx-auto">
                    {stat.description}
                  </p>
                </div>
                {index < stats.length - 1 && (
                  <div className="w-px h-16 bg-primary/10 hidden sm:block mx-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
