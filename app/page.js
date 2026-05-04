import { Footer, Header, TopBar } from "@/components/layout";
import {
    CTABanner,
    FAQ,
    Hero,
    HowItWorks,
    Services,
    Testimonials,
    TrustBar,
    WhySubzy
} from "@/components/sections";

/**
 * Subzy Homepage
 * Main landing page for the subsidy application service
 */
export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        {/* <HowItWorks />
        <WhySubzy /> */}
        <Testimonials />
        {/* <FAQ /> */}
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
