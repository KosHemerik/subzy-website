import { faqCategories, faqData, faqSets } from "./faqData";

export { faqCategories, faqData, faqSets };

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export const allFaqs = Object.values(faqData).flatMap((category) => category.questions);

const faqsById = Object.fromEntries(allFaqs.map((faq) => [faq.id, faq]));

/**
 * Geeft de vragen terug voor een lijst id's, in die volgorde.
 */
export function pickFaqs(ids) {
  return ids.map((id) => {
    const faq = faqsById[id];
    if (!faq) throw new Error(`Onbekende FAQ-id: ${id}`);
    return faq;
  });
}

/**
 * Antwoord zonder link-opmaak: [tekst](/pad) wordt "tekst".
 */
export function faqPlainText(answer) {
  return answer.replace(LINK_PATTERN, "$1");
}

/**
 * Splitst een antwoord in tekst- en linkdelen voor weergave.
 */
export function faqAnswerParts(answer) {
  const parts = [];
  let lastIndex = 0;
  for (const match of answer.matchAll(LINK_PATTERN)) {
    if (match.index > lastIndex) parts.push({ text: answer.slice(lastIndex, match.index) });
    parts.push({ text: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < answer.length) parts.push({ text: answer.slice(lastIndex) });
  return parts;
}

/**
 * FAQPage-schema (zonder @context, voor gebruik in een @graph).
 */
export function faqPageSchema(faqs) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faqPlainText(faq.answer) },
    })),
  };
}
