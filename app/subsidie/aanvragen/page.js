import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
import SvohWizard from "./svoh/SvohWizard";

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

        {/* Wizard */}
        <section className="bg-[#eef1f6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="max-w-3xl mx-auto bg-white rounded-3xl h-96 animate-pulse" />}>
            <SvohWizard />
          </Suspense>
        </section>

        {/* Trust row */}
        <section className="py-10 bg-white border-t border-gray-100">
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
