export default function OverOnsHero() {
  return (
    <section className="hero-bg py-20 curve-bottom w-full text-center px-4 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <h1
          className="hero-enter text-4xl lg:text-5xl font-bold text-white mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Wij maken complexe zaken simpel
        </h1>
        <p
          className="hero-enter text-lg text-blue-100 mb-10 max-w-2xl mx-auto"
          style={{ animationDelay: "0.2s" }}
        >
          Subzy helpt particuliere woningbezitters, verhuurders en VvE&apos;s bij het terugvragen van energiebelasting en het aanvragen van duurzaamheidssubsidies. Volledig ontzorgd, geen gedoe.
        </p>

        <div
          className="hero-enter flex flex-wrap justify-center gap-8 text-white"
          style={{ animationDelay: "0.35s" }}
        >
          <div>
            <div className="text-3xl font-bold">1.400+</div>
            <div className="text-blue-200 text-sm mt-1">aanvragen ingediend</div>
          </div>
          <div className="w-px bg-white/20 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold">€360K+</div>
            <div className="text-blue-200 text-sm mt-1">teruggegeven aan klanten</div>
          </div>
          <div className="w-px bg-white/20 hidden sm:block" />
          <div>
            <div className="text-3xl font-bold">8 jaar</div>
            <div className="text-blue-200 text-sm mt-1">ervaring in de sector</div>
          </div>
        </div>
      </div>
    </section>
  );
}
