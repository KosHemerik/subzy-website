import { Footer, Header, TopBar } from "@/components/layout";
import { Suspense } from "react";
import SvohWizard from "./SvohWizard";

export const metadata = {
  title: "SVOH Subsidie Aanvragen | Verhuurders & VvE | Subzy",
  description:
    "Vraag uw SVOH-subsidie aan via Subzy. Voor verhuurders en VvE's die warmtepompen, isolatie of zonneboilers plaatsen in huurwoningen. No Cure No Pay.",
};

export default function SvohAanvraagPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        {/* Page header */}
        <section className="hero-bg py-16 text-center curve-bottom overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-white/60 mb-2">SVOH subsidie aanvragen</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Start uw SVOH-aanvraag
            </h1>
            <p className="text-lg text-blue-100">
              Vul uw gegevens in — wij verwerken uw aanvraag en nemen binnen 2 werkdagen contact op.
            </p>
          </div>
        </section>

        {/* Wizard */}
        <section className="bg-[#eef1f6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-10 text-gray-400">Laden...</div>}>
            <SvohWizard regelingType="SVOH" />
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
