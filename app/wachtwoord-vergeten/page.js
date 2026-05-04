import { Footer, Header, TopBar } from "@/components/layout";
import { ForgotPasswordHero } from "./components";

export const metadata = {
  title: "Wachtwoord vergeten - Subzy",
  description: "Herstel uw wachtwoord voor het Subzy klantportaal.",
};

/**
 * Forgot Password Page
 * Password reset request page
 */
export default function ForgotPasswordPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <ForgotPasswordHero />
      </main>
      <Footer />
    </>
  );
}