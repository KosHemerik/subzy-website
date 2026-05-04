import { Footer, Header, TopBar } from "@/components/layout";
import {
    CoreValues,
    Mission,
    OverOnsCTA,
    OverOnsHero,
    Team,
    Testimonials,
    WhySubzy
} from "./components";

export const metadata = {
  title: "Over ons - Subzy",
  description: "Maak kennis met Subzy. Wij helpen particuliere woningbezitters bij het aanvragen van teruggave energiebelasting en duurzaamheidssubsidies.",
};

/**
 * Over Ons Page
 * Company information, mission, values, and team
 */
export default function OverOnsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <OverOnsHero />
        <Mission />
        <CoreValues />
        <WhySubzy />
        <Team />
        <Testimonials />
        <OverOnsCTA />
      </main>
      <Footer />
    </>
  );
}
