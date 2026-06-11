"use client";

import { useEffect, useRef } from "react";

const reviews = [
  {
    rating: 5,
    quote:
      "Subzy heeft het hele proces voor de ISDE-subsidie van onze warmtepomp uit handen genomen. Binnen enkele weken stond het bedrag op onze rekening.",
    name: "Peter de Jong",
    role: "Huiseigenaar uit Utrecht",
    initial: "P",
  },
  {
    rating: 5,
    quote:
      "Wij wisten niet dat we recht hadden op teruggave energiebelasting voor onze VvE. Subzy heeft dit uitgezocht en professioneel geregeld.",
    name: "Monique Veenstra",
    role: "VvE Bestuurder uit Amsterdam",
    initial: "M",
  },
  {
    rating: 5,
    quote:
      "Ik verhuur een pand met meerdere appartementen op een meter en had geen idee dat ik jaren heffingskorting was misgelopen. Subzy heeft alles uitgezocht en tot vijf jaar terug aangevraagd. Ik hoefde alleen mijn jaarnota en WOZ-beschikking aan te leveren. Binnen twee dagen wist ik waar ik aan toe was.",
    name: "Tom Rosdorff",
    role: "Particulier, teruggave energiebelasting",
    initial: "T",
  },
  {
    rating: 5,
    quote:
      "Voor onze portefeuille met meerdere panden achter gedeelde aansluitingen heeft Subzy de volledige teruggaaf geregeld, inclusief de jaarlijkse opvolging. Scheelt ons administratie en we missen geen termijnen meer. Duidelijke communicatie en je betaalt pas bij resultaat.",
    name: "Stevig Vastgoed B.V.",
    role: "Portefeuille, doorlopende dienstverlening",
    initial: "S",
  },
  {
    rating: 5,
    quote:
      "Wij dachten zelf niet in aanmerking te komen omdat onze situatie afwijkend was. Subzy heeft het kosteloos getoetst en er bleek toch een fors bedrag terug te halen over meerdere jaren. Professioneel afgehandeld, zonder dat wij er omkijken naar hadden.",
    name: "TRF Vastgoed B.V.",
    role: "Twijfelgeval dat toch lukte",
    initial: "T",
  },
];

function ReviewCard({ rating, quote, name, role, initial }) {
  return (
    <article className="w-full h-full bg-white border border-gray-200 rounded-3xl p-4 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-yellow-400 text-lg" aria-label={`${rating} van 5 sterren`}>
          {"★".repeat(rating)}
        </div>
        <i className="fa-solid fa-quote-right text-blue-100 text-2xl" aria-hidden="true" />
      </div>

      <p className="text-gray-600 italic text-[17px] leading-relaxed mb-4 flex-1">"{quote}"</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
          {initial}
        </div>
        <div>
          <p className="text-primary font-bold leading-tight">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsCarousel() {
  const listRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const logicalIndexRef = useRef(0);
  const baseCount = reviews.length;
  const START_COPY = 1;
  const loopedReviews = [...reviews, ...reviews, ...reviews];
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Wat onze klanten zeggen</h2>
            <p className="text-gray-600 text-lg">Ervaringen van mensen die wij al hebben geholpen.</p>
          </div>

          <div className="flex gap-2">
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
        </div>

        <div className="relative">
          <div
            ref={listRef}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-hidden pb-2"
            style={{ scrollPaddingInline: "22%" }}
          >
            {loopedReviews.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                data-carousel-card
                className="flex-none w-[74%] sm:w-[64%] lg:w-[52%] min-h-[280px] snap-center"
              >
                <ReviewCard {...review} />
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
