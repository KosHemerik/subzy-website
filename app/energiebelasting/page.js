import { Footer, Header, TopBar } from "@/components/layout";
import {
    Eligibility,
    HowItWorksTimeline,
    MidCTA,
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
      <main className="bg-white">
        <ServiceHero />
        <ProblemAwareness />
        <HowItWorksTimeline />
        <Eligibility />
        <MidCTA />
        <ServiceFAQ />
      </main>
      <Footer />
    </>
  );
}
