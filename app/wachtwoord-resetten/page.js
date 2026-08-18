import { Footer, Header, TopBar } from "@/components/layout";
import { ResetPasswordHero } from "./components";

export const metadata = {
  title: "Wachtwoord resetten - Subzy",
  description: "Stel een nieuw wachtwoord in voor uw Subzy klantportaal account.",
  robots: { index: false, follow: false },
};

/**
 * Reset Password Page
 * Landing page for the link sent by the forgot-password flow
 */
export default function ResetPasswordPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ResetPasswordHero />
      </main>
      <Footer />
    </>
  );
}
