"use client";

import { useGoogleRating } from "@/components/providers/GoogleRatingProvider";

/**
 * Renders the live Google rating as text (e.g. "4.8"), usable from server and client components.
 */
export default function RatingValue() {
  const { rating } = useGoogleRating();
  return rating;
}
