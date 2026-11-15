"use client";

import { useState } from "react";

/**
 * FAQ Hero Section with search functionality
 */
export default function FAQHero({ initialQuery = "", onSearch }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <>
      <section className="hero-bg py-16 curve-bottom text-center px-4 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Veelgestelde vragen over energiebelasting en subsidie
          </h1>
          <p className="text-lg text-blue-100">
            Vind snel antwoord op uw vragen over teruggave energiebelasting, de heffingskorting, ISDE- en SVOH-subsidie, warmtepompsubsidie en onze kosten.
          </p>
        </div>
      </section>

      {/* Search bar below hero */}
      <div className="bg-surface px-4 pt-12 pb-4 sm:pb-5">
        <div role="search" className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i aria-hidden="true" className="fa-solid fa-magnifying-glass text-gray-400" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Zoek in veelgestelde vragen"
            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-gray-800"
            placeholder="Zoek op trefwoord (bijv. 'warmtepomp', 'termijn', 'kosten')..."
          />
        </div>
      </div>
    </>
  );
}
