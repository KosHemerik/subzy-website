const values = [
  {
    icon: "fa-handshake",
    title: "Betrouwbaarheid",
    description: "Wij doen wat we beloven. Transparante communicatie en geen verborgen kosten. U weet altijd waar u aan toe bent.",
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "Eenvoud",
    description: "Wij maken complexe materie begrijpelijk. Geen juridisch jargon, maar heldere taal en een simpel proces voor u.",
  },
  {
    icon: "fa-shield-halved",
    title: "Zorgvuldigheid",
    description: "Uw gegevens zijn veilig bij ons. Wij behandelen elke aanvraag met de grootste precisie en aandacht voor detail.",
  },
];

/**
 * Core Values Section
 * Company core values with icons
 */
export default function CoreValues() {
  return (
    <section className="py-16 bg-background w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Onze kernwaarden</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dit zijn de principes die elk dossier, elk contact en elke aanvraag bepalen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div 
              key={value.title}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <i className={`fa-solid ${value.icon} text-2xl text-accent`} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
