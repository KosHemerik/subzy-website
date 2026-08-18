"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui";
import { COMPANY_INFO } from "@/lib/constants";

/**
 * Fetches live Google rating with a safe fallback to static company rating.
 */
export default function TopBarRating() {
  const [rating, setRating] = useState(COMPANY_INFO.rating);

  useEffect(() => {
    let mounted = true;

    const loadRating = async () => {
      try {
        const response = await fetch("/api/google-rating", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (!mounted) return;

        if (Number.isFinite(data?.rating)) {
          setRating(data.rating);
        }
      } catch {
        // Keep fallback rating if lookup fails.
      }
    };

    loadRating();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div aria-label="Klantbeoordeling" className="select-none">
      <StarRating rating={rating} showValue />
    </div>
  );
}