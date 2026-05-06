import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
import AanvraagForm from "./components/AanvraagForm";

export const metadata = {
  title: "Duurzaamheidssubsidie Aanvragen | Gratis Beoordeling | Subzy",
  description:
    "Vraag uw duurzaamheidssubsidie aan via Subzy. Warmtepomp, isolatie of zonneboiler — wij bepalen welke regeling voor u geldt en regelen de aanvraag. No Cure No Pay.",
};

export default function SubsidieAanvraagPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* Compact page header */}
        <section className="hero-bg py-10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/60 mb-2">Duurzaamheidssubsidie aanvragen</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Start uw subsidieaanvraag
            </h1>
            <p className="text-white/70 text-base">
              Vul uw gegevens in — wij beoordelen uw situatie en nemen binnen 2 werkdagen contact op.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:grid md:grid-cols-[55%_45%] gap-12">
              {/* Right column on mobile (form first) */}
              <div className="order-1 md:order-2">
                <Suspense fallback={<div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm h-96 animate-pulse" />}>
                  <AanvraagForm />
                </Suspense>
              </div>

              {/* Left column */}
              <div className="order-2 md:order-1 flex flex-col justify-start">
                <h2 className="text-2xl font-bold text-primary mb-3">Wat heeft u nodig?</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  U hoeft geen uitgebreide documenten te verzamelen om te starten. Vul uw gegevens
                  in en upload optioneel al een factuur — wij regelen de rest.
                </p>

                {/* Checkmark bullets */}
                <ul className="space-y-3 mb-8">
                  {[
                    "Geen uitgebreide documenten nodig om te starten",
                    "Beoordeling binnen 2 werkdagen",
                    "Wij bepalen welke subsidieregeling voor u geldt",
                    "100% No Cure No Pay — u betaalt alleen bij succes",
                    "Honorarium 20% excl. BTW — alleen bij succes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700">
                      <i className="fa-solid fa-circle-check text-secondary mt-0.5 text-base shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <hr className="border-gray-200 mb-8" />

                {/* Testimonial */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      SV
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fa-solid fa-star text-yellow-400 text-xs" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Sandra V. — Particulier, Amsterdam</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;Binnen 4 weken €2.400 subsidie ontvangen voor onze warmtepomp. Subzy regelde
                    alles, wij hoefden alleen wat foto&#39;s te sturen.&rdquo;
                  </p>
                </div>

                {/* Bellen CTA */}
                <div className="mt-6 text-sm text-gray-500">
                  <p>
                    Liever eerst bellen?{" "}
                    <a
                      href="tel:0681414967"
                      className="font-semibold text-primary hover:text-secondary transition"
                    >
                      06 81 41 49 67
                    </a>
                    <span className="text-gray-400"> — ma t/m vr 09:00–17:30</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust row */}
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-secondary" />
              <span>No Cure No Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bolt text-secondary" />
              <span>Reactie binnen 2 werkdagen</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" />
              <span>4.8/5 beoordeling</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
