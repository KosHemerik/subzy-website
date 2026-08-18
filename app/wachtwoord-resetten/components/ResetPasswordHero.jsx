import { Logo, StarRating } from "@/components/ui";
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

/**
 * Reset Password Hero Section
 * Contains the new-password form with a styled hero background
 */
export default function ResetPasswordHero() {
  return (
    <section className="hero-bg py-16 pb-24 px-4 relative overflow-hidden min-h-[calc(100vh-168px)] flex items-center w-full">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Nieuw wachtwoord instellen
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-md">
                Kies een nieuw wachtwoord voor uw Subzy klantportaal account.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6 text-white/80">
                <div className="flex items-center">
                  <i className="fa-solid fa-shield-halved text-secondary text-xl mr-3" />
                  <span className="text-sm">Veilige SSL-verbinding</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
                <StarRating rating={4.8} showValue />
                <span className="text-sm text-blue-100">Tevreden klanten</span>
              </div>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Logo />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">
                    Wachtwoord resetten
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Stel hieronder uw nieuwe wachtwoord in
                  </p>
                </div>

                <Suspense fallback={null}>
                  <ResetPasswordForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
