import Link from "next/link";
import { faqAnswerParts } from "@/lib/faq";

/**
 * Toont een FAQ-antwoord en zet [tekst](/pad) om in interne links.
 */
export default function FaqAnswer({ answer }) {
  return faqAnswerParts(answer).map((part, index) =>
    part.href ? (
      <Link
        key={index}
        href={part.href}
        className="text-secondary font-medium underline decoration-secondary/40 underline-offset-2 hover:text-primary transition"
      >
        {part.text}
      </Link>
    ) : (
      part.text
    )
  );
}
