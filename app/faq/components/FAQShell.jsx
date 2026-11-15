"use client";

import { useState } from "react";
import FAQContent from "./FAQContent";
import FAQHero from "./FAQHero";

export default function FAQShell({ initialCategory = "algemeen", initialQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  return (
    <div className="bg-surface">
      <FAQHero initialQuery={initialQuery} onSearch={setSearchQuery} />
      <FAQContent searchQuery={searchQuery} initialCategory={initialCategory} />
    </div>
  );
}
