import { TopBar, Header, Footer } from "@/components/layout";
import { ContactHero, ContactContent, FAQTeaser } from "./components";

export const metadata = {
  title: "Contact - Subzy",
  description: "Neem contact op met Subzy. Wij staan voor u klaar met vragen over subsidies en energiebelasting teruggave.",
};

/**
 * Contact Page
 * Contact form and company information
 */
export default function ContactPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ContactHero />
        <ContactContent />
        <FAQTeaser />
      </main>
      <Footer />
    </>
  );
}
