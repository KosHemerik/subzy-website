"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    text: "Subzy heeft het hele proces voor de ISDE subsidie voor mijn warmtepomp uit handen genomen. Ik hoefde alleen de factuur te sturen en zij regelden de rest. Binnen een paar weken stond het geld op mijn rekening. Top service!",
    name: "Peter de Jong",
    location: "Huiseigenaar uit Utrecht",
    initial: "P",
  },
  {
    text: "Ik wist niet eens dat ik recht had op teruggave energiebelasting voor onze VvE. Subzy heeft dit kosteloos voor ons uitgezocht en een aanzienlijk bedrag teruggehaald. Zeer professioneel en transparant gecommuniceerd.",
    name: "Monique Veenstra",
    location: "VvE Bestuurder uit Amsterdam",
    initial: "M",
  },
  {
    text: "Ik verhuur een pand met meerdere appartementen op een meter en had geen idee dat ik jaren heffingskorting was misgelopen. Subzy heeft alles uitgezocht en tot vijf jaar terug aangevraagd. Ik hoefde alleen mijn jaarnota en WOZ-beschikking aan te leveren. Binnen twee dagen wist ik waar ik aan toe was.",
    name: "Tom Rosdorff",
    location: "Particulier, teruggave energiebelasting",
    initial: "T",
  },
  {
    text: "Voor onze portefeuille met meerdere panden achter gedeelde aansluitingen heeft Subzy de volledige teruggaaf geregeld, inclusief de jaarlijkse opvolging. Scheelt ons administratie en we missen geen termijnen meer. Duidelijke communicatie en je betaalt pas bij resultaat.",
    name: "Stevig Vastgoed B.V.",
    location: "Portefeuille, doorlopende dienstverlening",
    initial: "S",
  },
  {
    text: "Wij dachten zelf niet in aanmerking te komen omdat onze situatie afwijkend was. Subzy heeft het kosteloos getoetst en er bleek toch een fors bedrag terug te halen over meerdere jaren. Professioneel afgehandeld, zonder dat wij er omkijken naar hadden.",
    name: "TRF Vastgoed B.V.",
    location: "Twijfelgeval dat toch lukte",
    initial: "T",
  },
];

export default function Testimonials() {
  const listRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const logicalIndexRef = useRef(0);
  const baseCount = testimonials.length;
  const START_COPY = 1;
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const SCROLL_DURATION = 520;

  const getCards = (container) => Array.from(container.querySelectorAll("[data-carousel-card]"));

  const getCenterTarget = (container, card) =>
    card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;

  const jumpTo = (container, target) => {
    const prevBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    container.scrollLeft = target;
    container.style.scrollBehavior = prevBehavior;
  };

  const toCenteredVirtualIndex = (logicalIndex) => {
    const normalized = ((logicalIndex % baseCount) + baseCount) % baseCount;
    return baseCount * START_COPY + normalized;
  };

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const cards = getCards(container);
    if (cards.length < baseCount * 3) return;

    requestAnimationFrame(() => {
      logicalIndexRef.current = 0;
      const startIndex = toCenteredVirtualIndex(logicalIndexRef.current);
      jumpTo(container, getCenterTarget(container, cards[startIndex]));
    });
  }, [baseCount]);

  const smoothScrollTo = (container, target, onDone) => {
    isAnimatingRef.current = true;
    const start = container.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animate = (now) => {
      const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      container.scrollLeft = start + change * eased;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onDone) onDone();
        isAnimatingRef.current = false;
      }
    };

    requestAnimationFrame(animate);
  };

  const scrollByCards = (direction) => {
    if (!listRef.current || isAnimatingRef.current) return;
    const container = listRef.current;
    const cards = getCards(container);
    if (cards.length < baseCount * 3) return;

    const delta = direction === "next" ? 1 : -1;
    const currentLogicalIndex = logicalIndexRef.current;
    const nextLogicalIndex = currentLogicalIndex + delta;
    const currentVirtualIndex = toCenteredVirtualIndex(currentLogicalIndex);
    const nextVirtualIndex = currentVirtualIndex + delta;

    jumpTo(container, getCenterTarget(container, cards[currentVirtualIndex]));
    const target = getCenterTarget(container, cards[nextVirtualIndex]);

    smoothScrollTo(container, target, () => {
      logicalIndexRef.current = ((nextLogicalIndex % baseCount) + baseCount) % baseCount;
      const resetIndex = toCenteredVirtualIndex(logicalIndexRef.current);
      requestAnimationFrame(() => {
        jumpTo(container, getCenterTarget(container, cards[resetIndex]));
      });
    });
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Wat onze klanten zeggen</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          Ervaringen van mensen die wij al hebben geholpen.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => scrollByCards("prev")}
            className="w-10 h-10 rounded-full border border-gray-300 text-primary hover:bg-gray-100 transition"
            aria-label="Vorige reviews"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards("next")}
            className="w-10 h-10 rounded-full border border-gray-300 text-primary hover:bg-gray-100 transition"
            aria-label="Volgende reviews"
          >
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>

        <div className="relative">
          <div
            ref={listRef}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-hidden pb-2"
            style={{ scrollPaddingInline: "22%" }}
          >
            {loopedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                data-carousel-card
                className="flex-none w-[74%] sm:w-[64%] lg:w-[52%] min-h-[280px] snap-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-left relative flex flex-col"
              >
                <i className="fa-solid fa-quote-right absolute top-5 right-5 text-3xl text-surface" />
                <div className="flex text-yellow-400 mb-3">
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                </div>
                <p className="text-gray-600 italic text-[17px] mb-4 flex-1">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/95 to-transparent" />
        </div>
      </div>
    </section>
  );
}
