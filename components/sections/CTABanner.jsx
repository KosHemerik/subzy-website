import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-primary rounded-2xl px-10 py-14 text-white overflow-hidden shadow-[0_20px_60px_-10px_rgba(27,58,107,0.5)]">
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Haal alles terug waar u recht op heeft
            </h2>
            <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
              Energiebelasting terugvragen of subsidie aanvragen — wij regelen het van A tot Z. Geen ingewikkelde formulieren, geen verborgen kosten. Start vandaag nog met uw gratis check.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/energiebelasting"
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-7 py-3 rounded-lg transition duration-300 shadow-lg w-full sm:w-auto"
              >
                Energiebelasting terugvragen <i className="fa-solid fa-arrow-right ml-2" />
              </Link>
              <Link
                href="/subsidie"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-7 py-3 rounded-lg transition duration-300 w-full sm:w-auto"
              >
                Subsidie aanvragen <i className="fa-solid fa-arrow-right ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
