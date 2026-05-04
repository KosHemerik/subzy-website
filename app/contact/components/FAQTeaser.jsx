import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * FAQ Teaser Section
 * Promotes the FAQ page for quick answers
 */
export default function FAQTeaser() {
  return (
    <section className="py-16 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Heeft u snel een antwoord nodig?
        </h2>
        <p className="text-gray-600 mb-8">
          Bekijk onze veelgestelde vragen. Grote kans dat uw vraag hier al tussen staat.
        </p>
        <Link href="/faq">
          <Button variant="outline" size="lg">
            Naar de FAQ pagina
          </Button>
        </Link>
      </div>
    </section>
  );
}
