import { Button } from "@/components/ui";
import Link from "next/link";

/**
 * Over Ons CTA Section
 * Call to action banner
 */
export default function OverOnsCTA() {
  return (
    <section className="py-16 bg-primary text-white max-w-[1440px] mx-auto text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Zet vandaag de eerste stap</h2>
        <p className="text-blue-200 mb-8 text-lg">
          Ontdek direct of u in aanmerking komt voor teruggave of subsidie. Onze check is volledig gratis en vrijblijvend.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/energiebelasting"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-3.5 rounded-lg transition duration-300 shadow-lg text-lg w-full sm:w-auto"
          >
            Start gratis intake
          </Link>
          <Link 
            href="/contact"
            className="inline-block border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-lg transition duration-300 text-lg w-full sm:w-auto"
          >
            Neem contact op
          </Link>
        </div>
      </div>
    </section>
  );
}
