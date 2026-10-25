"use client";

import { StarRating } from "@/components/ui";

/**
 * Shows the live Google rating (provided server-side via GoogleRatingProvider).
 */
export default function TopBarRating() {
  return (
    <div aria-label="Klantbeoordeling" className="select-none">
      <StarRating showValue />
    </div>
  );
}
