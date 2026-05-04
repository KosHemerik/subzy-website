import Link from "next/link";
import { COMPANY_INFO } from "@/lib/constants";

/**
 * Contact CTA Section for FAQ page
 */
export default function ContactCTA() {
  return (
    <section className="py-16 bg-primary text-white text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Staat uw vraag er niet tussen?
        </h2>
        <p className="text-blue-200 mb-8 text-lg">
          Onze specialisten staan klaar om u persoonlijk verder te helpen. Neem
          gerust contact met ons op.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
          <a
            href={COMPANY_INFO.phone.href}
            className="flex items-center text-xl font-medium hover:text-yellow-400 transition"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <i className="fa-solid fa-phone" />
            </div>
            {COMPANY_INFO.phone.display}
          </a>
          <a
            href={COMPANY_INFO.email.href}
            className="flex items-center text-xl font-medium hover:text-yellow-400 transition"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
              <i className="fa-solid fa-envelope" />
            </div>
            {COMPANY_INFO.email.display}
          </a>
        </div>

        <Link
          href="/contact"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-3.5 rounded-lg transition duration-300 shadow-lg text-lg"
        >
          Ga naar de contactpagina
        </Link>
      </div>
    </section>
  );
}
