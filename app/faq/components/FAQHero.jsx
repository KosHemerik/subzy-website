"use client";

import { useState } from "react";

/**
 * FAQ Hero Section with search functionality
 */
export default function FAQHero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

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
            Heeft u een vraag? Wij hebben het antwoord.
          </h1>
          <p className="text-lg text-blue-100">
            Vind snel antwoord op de meest gestelde vragen rondom energiebelasting en duurzaamheidssubsidies.
          </p>
        </div>
      </section>

      {/* Search bar below hero */}
      <div className="bg-background px-4 py-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-gray-800"
            placeholder="Zoek op trefwoord (bijv. 'isolatie', 'termijn', 'kosten')..."
          />
        </div>
      </div>
    </>
  );
}
