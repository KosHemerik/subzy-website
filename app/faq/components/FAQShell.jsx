"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FAQContent from "./FAQContent";
import FAQHero from "./FAQHero";

export default function FAQShell() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "algemeen";

  return (
    <div className="bg-surface">
      <FAQHero onSearch={setSearchQuery} />
      <FAQContent searchQuery={searchQuery} initialCategory={initialCategory} />
    </div>
  );
}
