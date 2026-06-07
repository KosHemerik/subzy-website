import Link from "next/link";

export default function IsdeHero() {
  const measures = [
    { icon: "fa-solid fa-temperature-arrow-up", label: "Warmtepomp", amount: "tot €3.500" },
    { icon: "fa-solid fa-sun", label: "Zonneboiler", amount: "tot €800" },
    { icon: "fa-solid fa-house", label: "Isolatie (dak/vloer/gevel)", amount: "tot €30/m²" },
    { icon: "fa-solid fa-wind", label: "Ventilatiesysteem", amount: "tot €1.400" },
    { icon: "fa-solid fa-plug", label: "Elektrisch koken", amount: "tot €122" },
  ];

  return (
    <section className="hero-bg relative pt-20 pb-24 curve-bottom w-full overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <i className="fa-solid fa-leaf text-green-400 mr-2" />
              <span className="text-white text-sm font-medium">ISDE Subsidie 2026</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Tot <span className="text-secondary">€3.500,-</span> subsidie voor uw verduurzaming
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              De ISDE (Investeringssubsidie Duurzame Energie en Energiebesparing) is een rijkssubsidie voor
              particulieren én bedrijven die investeren in energiebesparende maatregelen. Wij regelen uw aanvraag volledig — van A tot Z.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-10">
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-secondary mr-2" />
                No Cure No Pay
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-clock text-secondary mr-2" />
                Binnen 2 werkdagen duidelijkheid
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-star text-yellow-400 mr-2" />
                4.8/5 Klantbeoordeling
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/subsidie/aanvragen/isde"
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-7 py-3 rounded-xl transition duration-200 shadow-lg"
              >
                Start gratis subsidiecheck <i className="fa-solid fa-arrow-right ml-2" />
              </Link>
              <a
                href="#maatregelen"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3 rounded-xl transition duration-200"
              >
                Bekijk maatregelen
              </a>
            </div>
          </div>

          {/* Right — measures card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full lg:ml-auto">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-euro-sign text-green-600 text-sm" />
              </div>
              <h2 className="text-base font-bold text-primary">Subsidiebedragen 2026</h2>
            </div>

            <div className="space-y-3">
              {measures.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <i className={`${m.icon} text-secondary text-xs`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{m.label}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{m.amount}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <i className="fa-solid fa-circle-info text-green-600 mt-0.5 shrink-0" />
              <p className="text-xs text-green-800">
                In 2026 is <strong>€500 miljoen</strong> beschikbaar. Vraag op tijd aan — het budget raakt ieder jaar op.
              </p>
            </div>

            <Link href="/subsidie/aanvragen/isde">
              <button className="w-full mt-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-primary font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                Bereken mijn subsidie <i className="fa-solid fa-arrow-right ml-2 text-sm" />
              </button>
            </Link>
            <p className="text-center text-xs text-gray-400 mt-2">
              Gratis · Geen verplichtingen · No Cure No Pay
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
