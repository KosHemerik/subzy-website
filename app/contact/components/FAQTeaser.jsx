import Link from "next/link";

export default function FAQTeaser() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Misschien staat uw vraag er al tussen
        </h2>
        <p className="text-gray-600 mb-8">
          Meer dan 20 vragen beantwoord over subsidies en energiebelasting teruggave.
        </p>
        <Link
          href="/faq"
          className="inline-flex items-center font-bold transition duration-300 rounded-lg border-2 border-primary text-primary hover:bg-gray-50 px-7 py-3 text-base"
        >
          Naar de FAQ pagina
        </Link>
      </div>
    </section>
  );
}
