import { TopBar, Header, Footer } from "@/components/layout";
import { LoginHero } from "./components";

export const metadata = {
  title: "Inloggen - Subzy Klantportaal",
  description: "Log in op uw Subzy klantportaal om uw subsidieaanvragen en teruggaven te beheren.",
};

/**
 * Login Page - Klantportaal Inloggen
 * Allows users to login to their account
 */
export default function LoginPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <LoginHero />
      </main>
      <Footer />
    </>
  );
}
