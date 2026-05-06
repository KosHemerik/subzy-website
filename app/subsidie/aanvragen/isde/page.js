import { Suspense } from "react";
import { Footer, Header, TopBar } from "@/components/layout";
import SvohWizard from "../svoh/SvohWizard";

export const metadata = {
  title: "ISDE Subsidie Aanvragen | Particulieren | Subzy",
  description:
    "Vraag uw ISDE-subsidie aan via Subzy. Voor particulieren die een warmtepomp, zonneboiler of isolatie plaatsen. No Cure No Pay.",
};

export default function IsdeAanvraagPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* Page header */}
        <section className="hero-bg py-10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/60 mb-2">ISDE subsidie aanvragen</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Start uw ISDE-aanvraag
            </h1>
            <p className="text-white/70 text-base">
              Vul uw gegevens in — wij verwerken uw aanvraag en nemen binnen 2 werkdagen contact op.
            </p>
          </div>
        </section>

        {/* Wizard */}
        <section className="bg-[#eef1f6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-10 text-gray-400">Laden...</div>}>
            <SvohWizard regelingType="ISDE" doelgroepProp="particulier" />
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
