"use client";

/**
 * Problem Awareness Section
 * "Wist u dat u mogelijk te veel energiebelasting betaalt?"
 */
export default function ProblemAwareness() {
  const stats = [
    {
      value: "78%",
      description: "Komt in aanmerking voor teruggave",
    },
    {
      value: "€640",
      description: "Gemiddelde teruggave per klant",
    },
    {
      value: "5 jaar",
      description: "Maximale terugwerkende kracht",
    },
  ];

  return (
    <section id="problem" className="-mt-16 pt-36 pb-20 bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
           Veel mensen betalen onnodig te veel energiebelasting
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
Door onduidelijke regelgeving en versnipperde aansluitingen wordt belasting vaak onjuist berekend. 
Het gevolg: u betaalt jaarlijks honderden tot duizenden euro’s te veel — zonder dat dit automatisch wordt gecorrigeerd. De mogelijkheid om energiebelasting terug te vragen bestaat, maar wordt zelden benut omdat deze nauwelijks bekend is en niet actief wordt gecommuniceerd door instanties.
</p>          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-4xl font-bold text-secondary mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
