import { Footer, Header, TopBar } from "@/components/layout";
import AanvraagForm from "./components/AanvraagForm";

export const metadata = {
  title: "Energiebelasting Teruggave Aanvragen | Gratis Scan | Subzy",
  description:
    "Vraag gratis uw energiebelasting teruggave aan. Geen energienota nodig, geen verplichtingen. Subzy beoordeelt uw situatie binnen 2 werkdagen. No Cure No Pay.",
};

export default function AanvraagPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* Compact page header */}
        <section className="hero-bg py-10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/60 mb-2">
              Energiebelasting teruggave aanvragen
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Start uw gratis energiescan
            </h1>
            <p className="text-white/70 text-base">
              Vul uw gegevens in — wij nemen binnen 2 werkdagen contact op.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse md:grid md:grid-cols-[55%_45%] gap-12">
              {/* Left column */}
              <div className="flex flex-col justify-start">
                <h2 className="text-2xl font-bold text-primary mb-3">
                  Wat heeft u nodig?
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  U heeft geen energienota nodig om te starten. Wij beoordelen
                  uw situatie op basis van uw adresgegevens.
                </p>

                {/* Checkmark bullets */}
                <ul className="space-y-3 mb-8">
                  {[
                    "Geen energienota nodig om te starten",
                    "Beoordeling binnen 2 werkdagen",
                    "100% No Cure No Pay — u betaalt alleen bij succes",
                    "Terugvorderen tot 5 jaar terug mogelijk",
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
                      MV
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fa-solid fa-star text-yellow-400 text-xs" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Martijn V. — Verhuurder, Utrecht
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;Binnen 3 weken €1.207,- teruggekregen. Subzy regelde alles,
                    ik hoefde niets te doen.&rdquo;
                  </p>
                </div>

                {/* Bellen CTA */}
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-1">Liever eerst bellen?</p>
                  <a
                    href="tel:0681414967"
                    className="font-semibold text-primary hover:text-secondary transition"
                  >
                    06 81 41 49 67
                  </a>
                  <span className="text-gray-400"> — ma t/m vr 09:00–17:30</span>
                </div>
              </div>

              {/* Right column — form */}
              <div>
                <AanvraagForm />
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
