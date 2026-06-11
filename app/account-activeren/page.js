import { Footer, Header, TopBar } from "@/components/layout";
import { ActivateAccountHero } from "./components";

export const metadata = {
  title: "Account activeren - Subzy",
  description: "Stel uw wachtwoord in en activeer uw Subzy klantportaal account.",
};

export default function AccountActiverenPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ActivateAccountHero />
      </main>
      <Footer />
    </>
  );
}
