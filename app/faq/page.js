"use client";

import { useState } from "react";
import { TopBar, Header, Footer } from "@/components/layout";
import { FAQHero, FAQContent, ContactCTA } from "./components";

/**
 * FAQ Page - Veelgestelde Vragen
 * Dedicated FAQ page with categories and search functionality
 */
export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <FAQHero onSearch={setSearchQuery} />
        <FAQContent searchQuery={searchQuery} />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
