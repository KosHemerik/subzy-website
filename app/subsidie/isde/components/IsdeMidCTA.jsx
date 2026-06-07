import Link from "next/link";

const benefits = [
  {
    icon: "fa-solid fa-shield-halved",
    title: "No Cure No Pay",
    description: "Geen subsidie uitbetaald? Dan betaalt u ons niets.",
  },
  {
    icon: "fa-solid fa-rocket",
    title: "Snel en compleet",
    description: "Wij dienen uw aanvraag correct en volledig in bij RVO.",
  },
  {
    icon: "fa-solid fa-hands-holding",
    title: "Volledige ontzorging",
    description: "Van check tot uitbetaling — u hoeft zelf niets te regelen.",
  },
  {
    icon: "fa-solid fa-user-tie",
    title: "ISDE-specialisten",
    description: "Wij kennen de subsidielijst, de regels en de valkuilen.",
  },
];

export default function IsdeMidCTA() {
  return (
    <section className="py-16 bg-background w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center bg-white text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-gray-200">
          <i className="fa-solid fa-star text-yellow-400 mr-2" />
          Waarom via Subzy?
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          Mis geen euro subsidie die u toekomt
        </h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          ISDE aanvragen is gratis, maar een fout in de aanvraag of een verkeerde volgorde kan u uw subsidie kosten. Wij zorgen dat het goed gaat.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-3 text-accent transition-transform duration-300 group-hover:scale-110">
                <i className={b.icon} />
              </div>
              <p className="font-semibold text-primary text-sm">{b.title}</p>
              <p className="text-gray-500 text-xs mt-1">{b.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/subsidie/aanvragen/isde"
          className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-4 rounded-xl transition duration-200 shadow-lg text-lg"
        >
          <i className="fa-solid fa-leaf mr-2" />
          Start mijn subsidiecheck
        </Link>
        <p className="text-gray-400 text-sm mt-4">
          Gratis check · Geen verplichtingen · Binnen 2 werkdagen duidelijkheid
        </p>
      </div>
    </section>
  );
}
