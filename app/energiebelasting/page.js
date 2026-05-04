import { Footer, Header, TopBar } from "@/components/layout";
import {
  Calculator,
  Eligibility,
  HowItWorksTimeline,
  MidCTA,
  Pricing,
  ProblemAwareness,
  ServiceFAQ,
  ServiceHero,
} from "./components";

export const metadata = {
  title: "Teruggave Energiebelasting | Subzy",
  description:
    "Claim uw teruggave energiebelasting eenvoudig met Subzy. Wij regelen alles voor u.",
};

export default function TeruggaveEnergiebelastingPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ServiceHero />
        <ProblemAwareness />
        <HowItWorksTimeline />
        <Eligibility />
        <MidCTA />
        {/* <Pricing /> */}
        <Calculator />
        <ServiceFAQ />
      </main>
      <Footer />
    </>
  );
}
