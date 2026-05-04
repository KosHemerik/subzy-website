const measures = [
  {
    icon: "fa-solid fa-house-chimney-window",
    title: "Isolatie",
    description: "Dak-, spouwmuur-, vloer-, of glasisolatie (HR++ of Triple glas).",
  },
  {
    icon: "fa-solid fa-fan",
    title: "Warmtepomp",
    description: "Hybride of volledig elektrische warmtepompen.",
  },
  {
    icon: "fa-solid fa-solar-panel",
    title: "Zonneboiler",
    description: "Zonneboilersystemen voor warm water.",
  },
  {
    icon: "fa-solid fa-plug-circle-plus",
    title: "Combinaties",
    description: "Extra subsidie bij het combineren van meerdere maatregelen.",
  },
];

export default function WhatMeasures() {
  return (
    <section id="maatregelen" className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Voor welke maatregelen?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vraag subsidie aan voor de volgende verduurzamingsmaatregelen in uw woning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {measures.map((item, index) => (
            <div
              key={index}
              className="bg-surface p-6 rounded-2xl text-center hover:shadow-md transition"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-secondary text-2xl shadow-sm">
                <i className={item.icon} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
