import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-bg relative pt-24 pb-32 curve-bottom min-h-[620px] overflow-hidden">
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-24 top-16 w-[480px] h-[480px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute right-0 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[3fr_1fr] gap-12 items-center">

          {/* Left: text + CTAs */}
          <div className="text-center lg:text-left">

            {/* Pill badge */}
            <div
              className="hero-enter inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6"
              style={{ animationDelay: "0.05s" }}
            >
              <span aria-hidden="true" className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Ruim 1.400+ aanvragen succesvol ingediend</span>
            </div>

            <h1
              className="hero-enter text-4xl md:text-5xl font-bold leading-tight mb-3 text-white"
              style={{ animationDelay: "0.15s" }}
            >
              Energiebelasting terugvragen of subsidie aanvragen?
            </h1>
            <p
              className="hero-enter text-2xl md:text-3xl font-bold text-secondary mb-6"
              style={{ animationDelay: "0.25s" }}
            >
              Wij regelen het volledig voor u.
            </p>
            <p
              className="hero-enter text-lg text-gray-200 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ animationDelay: "0.35s" }}
            >
              Veel verhuurders, VvE&apos;s en particulieren betalen onnodig te veel energiebelasting of laten verduurzamingssubsidie liggen. Subzy regelt de teruggave of subsidie aanvraag volledig voor u, op basis van No Cure No Pay.
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-enter flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 mb-8"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/energiebelasting"
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-7 py-3 rounded-lg transition duration-300 shadow-lg w-full sm:w-auto"
              >
                Energiebelasting terugvragen <i aria-hidden="true" className="fa-solid fa-arrow-right ml-2" />
              </Link>
              <Link
                href="/subsidie"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-7 py-3 rounded-lg transition duration-300 w-full sm:w-auto"
              >
                Subsidie aanvragen <i aria-hidden="true" className="fa-solid fa-arrow-right ml-2" />
              </Link>
            </div>

          </div>

          {/* Right: result card */}
          <div className="hidden lg:flex items-center justify-center">
            <div
              className="hero-enter-right relative"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative">

              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 pb-14 w-[320px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <i aria-hidden="true" className="fa-solid fa-check text-green-500" />
                  </div>
                  <span className="font-semibold text-primary">Teruggave geregeld</span>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Ontvangen bedrag</span>
                  <div className="text-5xl font-bold text-primary mt-1">€2.350</div>
                  <span className="text-sm text-green-600 font-medium mt-1 block">
                    <i aria-hidden="true" className="fa-solid fa-circle-check mr-1" /> Succesvol uitbetaald
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex gap-1 mb-2" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i key={i} className="fa-solid fa-star text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed">
                    &ldquo;Snel alles geregeld. Subzy heeft €2.350 voor ons teruggehaald!&rdquo;
                  </p>
                  <span className="text-xs text-gray-400 mt-3 block">— J. van den Berg, Leiden</span>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-primary text-xs font-bold px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
                No Cure No Pay
              </div>

              {/* Floating stat bottom-left */}
              <div className="absolute -bottom-5 -left-6 bg-primary-dark text-white px-4 py-3 rounded-xl shadow-xl border border-white/10">
                <div className="font-bold text-xl">€360K+</div>
                <div className="text-white/60 text-xs">teruggegeven aan klanten</div>
              </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
