import Link from "next/link";

/**
 * Call to action banner section
 */
export default function CTABanner() {
  return (
    <section className="py-16 bg-primary text-white w-full">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start je subsidie aanvraag in 3 minuten
        </h2>
        <p className="text-lg text-blue-200 mb-8">
          Geen stress, geen documenten, geen kosten. Wij doen het voor je. Start nu met onze gratis check.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/energiebelasting"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-8 py-3.5 rounded-lg transition duration-300 shadow-lg text-lg w-full sm:w-auto justify-center"
          >
            Start gratis check <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
          <Link 
            href="/contact"
            className="inline-flex items-center border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-lg transition duration-300 text-lg w-full sm:w-auto justify-center"
          >
            Neem contact op
          </Link>
        </div>
      </div>
    </section>
  );
}
