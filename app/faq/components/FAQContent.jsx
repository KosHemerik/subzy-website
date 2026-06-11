"use client";

import { useState, useMemo } from "react";
import { COMPANY_INFO } from "@/lib/constants";

const faqCategories = [
  {
    id: "algemeen",
    label: "Algemeen",
    icon: "fa-regular fa-comment-dots",
  },
  {
    id: "energiebelasting",
    label: "Teruggave Energiebelasting",
    icon: "fa-solid fa-bolt",
  },
  {
    id: "subsidies",
    label: "Subsidies (ISDE)",
    icon: "fa-solid fa-leaf",
  },
  {
    id: "proces",
    label: "Het Proces",
    icon: "fa-solid fa-list-check",
  },
  {
    id: "kosten",
    label: "Kosten & Tarieven",
    icon: "fa-solid fa-euro-sign",
  },
];

const faqData = {
  algemeen: {
    title: "Algemene Vragen",
    questions: [
      {
        question: "Wat doet Subzy precies?",
        answer:
          "Subzy helpt particuliere woningbezitters in Nederland bij het terugvragen van te veel betaalde energiebelasting en het aanvragen van duurzaamheidssubsidies (zoals de ISDE). Wij nemen het complexe papierwerk en de communicatie met instanties zoals het RVO of de Belastingdienst volledig uit handen.",
      },
      {
        question: "Hoe weet ik of ik in aanmerking kom?",
        answer:
          "U kunt op onze website een gratis en vrijblijvende check doen. Vul enkele basisgegevens in via onze intakeformulieren voor energiebelasting of duurzaamheidssubsidie. Wij beoordelen direct of u in aanmerking komt en wat de verwachte opbrengst is.",
      },
      {
        question: "Is Subzy een onderdeel van de overheid?",
        answer:
          "Nee, Subzy is een onafhankelijk, commercieel adviesbureau. Wij treden op als uw gemachtigde om namens u de aanvragen in te dienen bij overheidsinstanties.",
      },
      {
        question: "Hoe lang bestaat Subzy al?",
        answer:
          "Subzy is opgericht in 2020 en heeft sindsdien duizenden huishoudens geholpen met het aanvragen van subsidies en energiebelasting teruggaves. Wij hebben ruime ervaring en weten precies hoe de aanvraagprocedures werken.",
      },
      {
        question: "Kan ik ook als huurder gebruik maken van jullie diensten?",
        answer:
          "Voor de meeste subsidies en teruggaves moet u eigenaar zijn van de woning. In sommige gevallen kunnen huurders ook in aanmerking komen, bijvoorbeeld als u zelf een warmtepomp of zonnepanelen heeft laten installeren met toestemming van de verhuurder. Neem contact met ons op voor uw specifieke situatie.",
      },
    ],
  },
  energiebelasting: {
    title: "Teruggave Energiebelasting",
    questions: [
      {
        question: "Wat is de Teruggave Energiebelasting?",
        answer:
          "De Teruggave Energiebelasting is een wettelijke regeling waarmee eigenaren van panden met meerdere woningen of WOZ-objecten achter één elektriciteitsaansluiting de te veel betaalde energiebelasting kunnen terugvorderen bij de Belastingdienst.",
      },
      {
        question: "Hoe weet ik of ik in aanmerking kom?",
        answer:
          "Als u meerdere woningen, appartementen of WOZ-objecten heeft die aangesloten zijn op één elektriciteitsaansluiting, komt u mogelijk in aanmerking. Vraag onze vrijblijvende scan aan en wij beoordelen het voor u.",
      },
      {
        question: "Hoeveel kan ik terugkrijgen?",
        answer:
          "Het bedrag verschilt per jaar en per aansluiting. Omdat u tot vijf jaar terug kunt vorderen, kan het totaalbedrag aanzienlijk oplopen. Wij berekenen het exacte bedrag na de gratis scan.",
      },
      {
        question: "Hoe ver terug kan ik de teruggave aanvragen?",
        answer:
          "U kunt tot vijf jaar met terugwerkende kracht terugvorderen.",
      },
      {
        question: "Wat moet ik aanleveren?",
        answer:
          "Wij vragen u om uw energiejaarafrekening en een WOZ-aanslag. Wij regelen de rest volledig voor u.",
      },
      {
        question: "Hoe lang duurt het proces?",
        answer:
          "Na het indienen van de aanvraag bij de Belastingdienst duurt het gemiddeld enkele weken tot maanden voordat de teruggave wordt uitbetaald. Wij houden u op de hoogte.",
      },
      {
        question: "Moet ik ieder jaar opnieuw een aanvraag indienen?",
        answer:
          "Ja, de regeling vereist jaarlijkse opvolging. Als u dat wenst zorgen wij elk jaar opnieuw voor de aanvraag zodat u geen teruggave misloopt.",
      },
      {
        question: "Wat kost het?",
        answer:
          "Wij werken uitsluitend op basis van No cure, No pay. U betaalt alleen een percentage van de daadwerkelijk ontvangen teruggave. Als wij niets terugkrijgen, betaalt u niets.",
      },
      {
        question: "Is er een financieel risico voor mij?",
        answer:
          "Nee. Omdat wij op No cure, No pay basis werken draagt u geen enkel financieel risico.",
      },
      {
        question: "Is dit legaal?",
        answer:
          "Ja, de Teruggave Energiebelasting is een officiële wettelijke regeling van de Nederlandse overheid. Wij dienen de aanvraag namens u in bij de Belastingdienst via de daarvoor bestemde procedure.",
      },
      {
        question: "Waarom heeft de Belastingdienst mij hier niet op gewezen?",
        answer:
          "De Belastingdienst wijst eigenaren hier niet actief op. Het is uw eigen verantwoordelijkheid om de teruggave aan te vragen, wat veel eigenaren niet weten.",
      },
      {
        question: "Voor hoeveel klanten hebben jullie dit al geregeld?",
        answer:
          "Wij hebben al meer dan 1.400 aanvragen succesvol afgerond voor eigenaren, verhuurders en VvE's door heel Nederland.",
      },
    ],
  },
  subsidies: {
    title: "Subsidies (ISDE)",
    questions: [
      {
        question: "Binnen welke termijn moet ik de ISDE-subsidie aanvragen?",
        answer:
          "U moet uw subsidieaanvraag indienen binnen 24 maanden nadat de werkzaamheden zijn uitgevoerd en betaald. De datum op de factuur is hierbij leidend.",
      },
      {
        question: "Welke maatregelen komen in aanmerking voor ISDE?",
        answer:
          "De ISDE (Investeringssubsidie Duurzame Energie) geldt voor warmtepompen, zonneboilers, isolatiemaatregelen (zoals dak-, vloer- en gevelisolatie) en aansluiting op een warmtenet. Elk type maatregel heeft specifieke voorwaarden.",
      },
      {
        question: "Hoeveel subsidie kan ik krijgen?",
        answer:
          "De subsidie varieert per maatregel. Voor warmtepompen kan dit oplopen tot enkele duizenden euro's. Voor isolatie hangt het af van het aantal vierkante meters en het type isolatie. Wij berekenen het exacte bedrag voor u.",
      },
      {
        question: "Kan ik meerdere subsidies combineren?",
        answer:
          "Ja, u kunt meerdere ISDE-subsidies combineren als u verschillende maatregelen neemt. Bijvoorbeeld isolatie én een warmtepomp. Let op: sommige subsidies mogen niet gecombineerd worden. Wij adviseren u hierover.",
      },
      {
        question: "Moet de installateur gecertificeerd zijn?",
        answer:
          "Ja, voor de meeste ISDE-subsidies moet de installateur aan bepaalde eisen voldoen. Het product moet ook op de ISDE-productlijst staan. Wij controleren dit voor u tijdens de aanvraag.",
      },
    ],
  },
  proces: {
    title: "Het Proces",
    questions: [
      {
        question: "Hoe lang duurt de afhandeling van mijn aanvraag?",
        answer:
          "Na het indienen van een complete aanvraag duurt het bij het RVO (voor subsidies) gemiddeld 6 tot 8 weken voordat u een beslissing ontvangt. Voor energiebelasting kan dit variëren tussen de 4 en 12 weken.",
      },
      {
        question: "Welke documenten heb ik nodig?",
        answer:
          "Dit verschilt per aanvraag. Voor energiebelasting hebben we jaarrekeningen van uw energieleverancier nodig. Voor ISDE-subsidie vragen we om facturen en betaalbewijzen van de installateur. Via ons klantportaal ziet u precies wat er nodig is.",
      },
      {
        question: "Hoe werkt het klantportaal?",
        answer:
          "Na aanmelding krijgt u toegang tot ons beveiligde klantportaal. Hier kunt u documenten uploaden, de status van uw aanvraag volgen en communiceren met onze specialisten. U ontvangt automatische updates bij elke statuswijziging.",
      },
      {
        question: "Kan ik de voortgang van mijn aanvraag volgen?",
        answer:
          "Ja, via ons klantportaal ziet u realtime de status van uw aanvraag. U ontvangt ook e-mailnotificaties bij belangrijke updates, zoals wanneer documenten zijn goedgekeurd of wanneer de uitbetaling is gedaan.",
      },
      {
        question: "Wat gebeurt er als mijn aanvraag wordt afgewezen?",
        answer:
          "Mocht uw aanvraag onverhoopt worden afgewezen, dan onderzoeken wij de mogelijkheden voor bezwaar. Bij No Cure No Pay betaalt u in dat geval niets. Wij streven ernaar om afwijzingen te voorkomen door vooraf grondig te controleren.",
      },
    ],
  },
  kosten: {
    title: "Kosten & Tarieven",
    questions: [
      {
        question: "Wat kost jullie dienstverlening?",
        answer:
          "Voor de teruggave energiebelasting werken we op basis van No Cure, No Pay: we rekenen 20% excl. BTW over het bedrag dat daadwerkelijk aan u wordt uitgekeerd. Voor ISDE-subsidies rekenen we 10% excl. BTW over de ontvangen subsidie. Wordt er niets uitgekeerd? Dan betaalt u ook niets.",
      },
      {
        question: "Zijn er vooraf kosten verbonden?",
        answer:
          "Nee, bij No Cure No Pay betaalt u alleen achteraf als de aanvraag succesvol is. U loopt dus geen financieel risico. Voor ISDE-subsidies met vast tarief betaalt u pas na het indienen van de aanvraag.",
      },
      {
        question: "Hoe wordt de betaling afgehandeld?",
        answer:
          "Na succesvolle uitbetaling door de Belastingdienst of RVO ontvangt u een factuur van ons. U kunt deze eenvoudig betalen via iDEAL of bankoverboeking. De betalingstermijn is 14 dagen.",
      },
      {
        question: "Kan ik de kosten van de belasting aftrekken?",
        answer:
          "De kosten voor onze dienstverlening zijn in veel gevallen aftrekbaar als advieskosten bij uw belastingaangifte. Wij adviseren u om dit met uw belastingadviseur te bespreken.",
      },
      {
        question: "Bieden jullie kortingen aan?",
        answer:
          "Voor VvE's en bij meerdere aanvragen tegelijk hanteren wij aantrekkelijke kortingen. Neem contact met ons op voor een offerte op maat.",
      },
    ],
  },
};

/**
 * FAQ Accordion Item Component
 */
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition focus:outline-none text-left"
        onClick={onToggle}
      >
        <span className="font-semibold text-primary">{question}</span>
        <i
          className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-5 bg-white border-t border-gray-100 text-gray-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

/**
 * Category Tab Button Component
 */
function CategoryTab({ category, isActive, onClick }) {
  return (
    <button
      className={`w-full text-left px-6 py-4 rounded-xl font-medium transition border ${
        isActive
          ? "bg-secondary text-white border-secondary shadow-sm"
          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      <i className={`${category.icon} w-6 text-center mr-2`} />
      {category.label}
    </button>
  );
}

/**
 * Trust Block Component
 */
function TrustBlock() {
  return (
    <div className="mt-8 bg-surface p-6 rounded-xl border border-blue-100">
      <div className="flex items-center justify-center mb-4">
        <div className="flex space-x-1 text-yellow-400 text-xl">
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star-half-stroke" />
        </div>
      </div>
      <p className="text-center font-bold text-primary text-xl mb-1">{COMPANY_INFO.rating}/5</p>
      <p className="text-center text-sm text-gray-600 mb-4">
        Klantreviews
      </p>
      <hr className="border-blue-200 mb-4" />
      <div className="flex items-center text-sm text-gray-700 mb-2">
        <i className="fa-solid fa-check text-secondary mr-2" />
        Wij reageren binnen 1 werkdag
      </div>
      <div className="flex items-center text-sm text-gray-700">
        <i className="fa-solid fa-check text-secondary mr-2" />
        100% Ontzorgd
      </div>
    </div>
  );
}

/**
 * Main FAQ Content Component with tabs and accordion
 */
export default function FAQContent({ searchQuery = "", initialCategory = "algemeen" }) {
  const [activeCategory, setActiveCategory] = useState(
    faqData[initialCategory] ? initialCategory : "algemeen"
  );
  const [openIndex, setOpenIndex] = useState(null);

  // Filter questions based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { [activeCategory]: faqData[activeCategory] };
    }

    const query = searchQuery.toLowerCase();
    const results = {};

    Object.entries(faqData).forEach(([categoryId, categoryData]) => {
      const filteredQuestions = categoryData.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      );

      if (filteredQuestions.length > 0) {
        results[categoryId] = {
          ...categoryData,
          questions: filteredQuestions,
        };
      }
    });

    return results;
  }, [searchQuery, activeCategory]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar / Tabs */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 space-y-2">
            {faqCategories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={!isSearching && activeCategory === category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenIndex(null);
                }}
              />
            ))}
            <TrustBlock />
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="lg:w-2/3">
          {isSearching ? (
            // Search results view
            Object.keys(filteredData).length > 0 ? (
              Object.entries(filteredData).map(([categoryId, categoryData]) => (
                <div key={categoryId} className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    {categoryData.title}
                  </h2>
                  <div className="space-y-4">
                    {categoryData.questions.map((faq, index) => (
                      <FAQItem
                        key={`${categoryId}-${index}`}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === `${categoryId}-${index}`}
                        onToggle={() =>
                          setOpenIndex(
                            openIndex === `${categoryId}-${index}`
                              ? null
                              : `${categoryId}-${index}`
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <i className="fa-solid fa-search text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600 text-lg">
                  Geen resultaten gevonden voor "{searchQuery}"
                </p>
                <p className="text-gray-500 mt-2">
                  Probeer een andere zoekterm of bekijk de categorieën
                </p>
              </div>
            )
          ) : (
            // Category view
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                {faqData[activeCategory].title}
              </h2>
              <div className="space-y-4">
                {faqData[activeCategory].questions.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onToggle={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
