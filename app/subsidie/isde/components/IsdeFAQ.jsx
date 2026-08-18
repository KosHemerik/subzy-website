"use client";

import Link from "next/link";
import { useState } from "react";

const faqItems = [
  {
    question: "Wat is de ISDE subsidie?",
    answer:
      "De ISDE (Investeringssubsidie Duurzame Energie en Energiebesparing) is een subsidieregeling van de Nederlandse rijksoverheid, uitgevoerd door RVO. Particuliere woningeigenaren en zakelijke partijen kunnen subsidie aanvragen voor energiebesparende maatregelen zoals warmtepompen, zonneboilers en isolatie.",
  },
  {
    question: "Hoeveel ISDE subsidie kan ik krijgen?",
    answer:
      "Het subsidiebedrag is afhankelijk van het type maatregel en het specifieke product. Voor een warmtepomp kunt u tot €3.500 ontvangen, voor een zonneboiler tot €800, en voor isolatie een vast bedrag per m². In 2026 is er in totaal €500 miljoen beschikbaar. Via onze gratis check berekenen we uw exacte subsidiebedrag.",
  },
  {
    question: "Moet ik eerst aanvragen en dan installeren, of andersom?",
    answer:
      "Voor particulieren geldt: u mag de maatregel al laten installeren en daarna nog aanvragen — mits de installateur en het product op de RVO-subsidielijst staan. Voor zakelijke aanvragers geldt echter een harde eis: de aanvraag moet worden ingediend vóórdat u het installatiebedrijf opdracht geeft. Vraagt u zakelijk aan? Neem dan eerst contact met ons op.",
  },
  {
    question: "Kan ik ISDE combineren met andere subsidies?",
    answer:
      "Ja, in veel gevallen kunt u ISDE combineren met andere regelingen zoals de BTW-vrijstelling op zonnepanelen, de Energiebespaarlening of gemeentelijke subsidies. Subzy helpt u bij het in kaart brengen van alle subsidies waar u recht op heeft, zodat u niets misloopt.",
  },
  {
    question: "Hoe lang duurt de aanvraagprocedure bij RVO?",
    answer:
      "Na indiening bij RVO ontvangt u doorgaans binnen enkele weken een beslissing. Voor particulieren gaat dit relatief snel. Zakelijke aanvragen kunnen iets langer duren vanwege de aanvullende controles. Wij houden u op de hoogte van de voortgang.",
  },
  {
    question: "Wat kost het om via Subzy aan te vragen?",
    answer:
      "Wij werken op basis van No Cure No Pay. U betaalt 10% excl. BTW over de ontvangen subsidie bij een succesvolle aanvraag. Wordt de subsidie niet toegekend? Dan betaalt u niets. De gratis subsidiecheck is altijd kosteloos en vrijblijvend.",
  },
  {
    question: "Moet het installatiebedrijf erkend zijn?",
    answer:
      "Ja, een erkend installatiebedrijf is verplicht. RVO controleert dit bij de aanvraag. Wij adviseren u over welke installateurs aan de voorwaarden voldoen en controleren dit voor u bij de indiening van uw aanvraag.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-primary pr-4">{question}</span>
        <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function IsdeFAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 lg:py-24 bg-white w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Veelgestelde vragen over ISDE</h2>
          <p className="text-gray-600">
            Alles wat u moet weten over de ISDE subsidie en hoe Subzy u helpt.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Staat uw vraag er niet bij?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition duration-200"
            >
              Neem contact op
            </Link>
            <Link
              href="/subsidie/aanvragen/isde"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-primary font-bold px-6 py-3 rounded-xl transition duration-200 shadow"
            >
              Start gratis subsidiecheck <i className="fa-solid fa-arrow-right ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
