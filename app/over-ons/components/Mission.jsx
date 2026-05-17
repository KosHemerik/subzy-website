/**
 * Mission Section
 * Company mission statement with image
 */
export default function Mission() {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img
            className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
            alt="Warmtepomp bij een woning"
          />
        </div>
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-primary">Onze Missie</h2>
          <div className="w-20 h-1 bg-accent rounded" />
          <p className="text-gray-600 text-lg leading-relaxed">
            Bij Subzy geloven we dat elke huiseigenaar recht heeft op de financiële voordelen die de overheid biedt voor verduurzaming en energie. Echter, de complexe regelgeving, lange wachttijden en onduidelijke formulieren werpen vaak een drempel op.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Onze missie is om deze drempel volledig weg te nemen. Wij fungeren als uw persoonlijke gids en belangenbehartiger in het woud van subsidies en belastingen. Wij nemen het papierwerk uit handen, communiceren met de instanties en zorgen ervoor dat u krijgt waar u recht op heeft, zonder de stress.
          </p>
        </div>
      </div>
    </section>
  );
}
