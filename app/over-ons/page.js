import { Footer, Header, TopBar } from "@/components/layout";
import {
    CoreValues,
    Mission,
    OverOnsCTA,
    OverOnsHero,
    Testimonials,
} from "./components";

export const metadata = {
  title: "Over ons - Subzy",
  description: "Maak kennis met Subzy. Wij helpen particuliere woningbezitters bij het aanvragen van teruggave energiebelasting en duurzaamheidssubsidies.",
};

export default function OverOnsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <OverOnsHero />
        <Mission />
        <CoreValues />
        <Testimonials />
        <OverOnsCTA />
      </main>
      <Footer />
    </>
  );
}
