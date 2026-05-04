import { Footer, Header, TopBar } from "@/components/layout";

export const metadata = {
  title: "SVOH Subsidie | Subzy",
  description: "Deze pagina wordt binnenkort bijgewerkt.",
};

export default function SvohPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center bg-background">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.896-3.42c.117-.085.24-.163.372-.233.755-.39 1.538-.6 2.282-.6a3.375 3.375 0 0 1 3.375 3.375c0 .75-.21 1.527-.6 2.282-.069.13-.148.253-.233.372"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">
            We zijn deze pagina aan het updaten
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            De SVOH-pagina wordt momenteel vernieuwd en is spoedig online. Heeft u een vraag? Neem dan gerust contact met ons op.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Neem contact op
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
