import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
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
      <main className="relative isolate bg-[#eef1f6] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[#eef1f6]"
        />
        {/* Page header */}
        <section className="relative z-10 py-16 text-center curve-bottom overflow-hidden bg-[linear-gradient(180deg,#1B3A6B_0%,#244e8a_62%,#eef1f6_100%)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/70 mb-2">ISDE subsidie aanvragen</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Start uw ISDE-aanvraag
            </h1>
            <p className="text-lg text-blue-100">
              Vul uw gegevens in — wij verwerken uw aanvraag en nemen binnen 2 werkdagen contact op.
            </p>
          </div>
        </section>

        {/* Wizard */}
        <section className="relative z-10 -mt-10 bg-[#eef1f6] min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-10 text-gray-400">Laden...</div>}>
            <SvohWizard regelingType="ISDE" doelgroepProp="particulier" />
          </Suspense>
        </section>

        {/* Trust row */}
        <section className="relative z-10 bg-[#eef1f6] border-t border-gray-200/70 py-10">
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
